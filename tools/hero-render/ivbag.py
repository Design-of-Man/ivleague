"""
Photorealistic IV bag hero, ray-traced in Cycles.

Not a generative render: everything is modelled geometry with physically based
shaders, so the emblem on the label is the practice's actual vector rather than
something a model hallucinated, and the scene re-renders deterministically at
any resolution.

  still  — one frame
  orbit  — N frames on a smooth arc, encoded to mp4

The splash is modelled, not simulated. A real FLIP solve is hours of compute per
second of footage; a crown of tapered sheets plus a ring of ballistic droplets
is what product CGI actually ships, and at this shutter speed it reads the same.

Scale convention: 1 Blender unit = 1 metre. The bag is 0.30 x 0.21 m, which is
roughly a real 1-litre IV bag, and every other size derives from that so the
splash cannot drift out of proportion again.
"""

import argparse
import math
import os
import random

import bpy
import bmesh
from mathutils import Vector

BAG_W, BAG_H, BAG_D = 0.30, 0.215, 0.062
WATERLINE = 0.0
POOL_DEPTH = 0.16


def srgb(hexstr, alpha=1.0):
    """Brand hexes are sRGB; Cycles wants linear."""
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, alpha)


def principled(mat):
    return mat.node_tree.nodes["Principled BSDF"]


# --------------------------------------------------------------------------- #
#                                   MATERIALS                                  #
# --------------------------------------------------------------------------- #

def mat_water():
    m = bpy.data.materials.new("water")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.94, 0.985, 1.0, 1)
    b.inputs["Roughness"].default_value = 0.0
    b.inputs["IOR"].default_value = 1.333
    b.inputs["Transmission Weight"].default_value = 1.0
    return m


def mat_foam():
    """
    Crown and rim water. Deliberately NOT glass.

    The first pass gave the crown the same transmissive shader as the pool and
    it rendered as black voids: a stack of thin solidified sheets exhausts the
    transmission bounce budget and Cycles returns black. It is also just wrong.
    Water thrown into air entrains bubbles, and aerated water is white and
    scattering, which is why high-speed splash photography shows opaque foam.
    """
    m = bpy.data.materials.new("foam")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.97, 0.99, 1.0, 1)
    b.inputs["Roughness"].default_value = 0.14
    b.inputs["IOR"].default_value = 1.333
    b.inputs["Transmission Weight"].default_value = 0.30
    b.inputs["Specular IOR Level"].default_value = 0.6
    return m


def mat_polymer():
    """
    Medical bag film.

    Earlier passes shaded this as optical glass and it read as an ice cube.
    Real IV stock is a soft, slightly hazy translucent polymer: light passes
    through it but scatters, which is why a bag on a stand glows rather than
    refracting like a lens. Roughness plus partial transmission gets that, and
    it also separates the bag from a white background far better than glass.
    """
    m = bpy.data.materials.new("polymer")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.955, 0.985, 0.995, 1)
    b.inputs["Roughness"].default_value = 0.26
    b.inputs["IOR"].default_value = 1.46
    b.inputs["Transmission Weight"].default_value = 0.72
    return m


def mat_port():
    """Moulded fitting at the outlet: opaque medical white, semi-gloss."""
    m = bpy.data.materials.new("port")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.82, 0.855, 0.875, 1)
    b.inputs["Roughness"].default_value = 0.33
    return m


def mat_fluid():
    m = bpy.data.materials.new("fluid")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.97, 1.0, 1.0, 1)
    b.inputs["Roughness"].default_value = 0.0
    b.inputs["IOR"].default_value = 1.333
    b.inputs["Transmission Weight"].default_value = 1.0
    return m


def mat_label(png):
    """
    The printed label, as its own material on its own plane.

    The first attempt projected this onto the bag through a mix shader keyed on
    the image alpha. The label art is opaque edge to edge, so the mix factor was
    1 everywhere and the whole bag rendered as painted white plastic. A separate
    card is both simpler and closer to how a real bag is made.
    """
    m = bpy.data.materials.new("label")
    m.use_nodes = True
    nt = m.node_tree
    b = principled(m)
    b.inputs["Roughness"].default_value = 0.38
    b.inputs["Specular IOR Level"].default_value = 0.35
    img = nt.nodes.new("ShaderNodeTexImage")
    img.image = bpy.data.images.load(png)
    img.interpolation = "Cubic"
    nt.links.new(img.outputs["Color"], b.inputs["Base Color"])
    return m


# --------------------------------------------------------------------------- #
#                                    SCENE                                     #
# --------------------------------------------------------------------------- #

def reset(samples):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.012
    # Refractive caustics are the reason to raytrace this at all: the bright
    # kidney of light the bag throws onto the white floor is most of what sells
    # it as glass. They are also the slowest paths in the scene.
    sc.cycles.caustics_reflective = True
    sc.cycles.caustics_refractive = True
    sc.cycles.max_bounces = 32
    sc.cycles.transmission_bounces = 32
    sc.cycles.transparent_max_bounces = 16
    sc.cycles.blur_glossy = 0.6
    sc.cycles.film_exposure = 1.25
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Punchy"
    sc.render.film_transparent = False
    return sc


def white_cove():
    """Seamless cyclorama: floor sweeping up into an unbroken white wall."""
    bpy.ops.mesh.primitive_plane_add(size=1)
    cove = bpy.context.object
    cove.name = "cove"
    bm = bmesh.new()
    bm.from_mesh(cove.data)
    bmesh.ops.delete(bm, geom=list(bm.faces), context="FACES")
    steps, depth, height, half = 48, 3.2, 2.4, 3.2
    verts = []
    for i in range(steps + 1):
        t = i / steps
        # flat run, then a quarter-circle sweep into vertical
        if t < 0.55:
            y = -1.4 + (t / 0.55) * (depth * 0.55)
            z = -POOL_DEPTH
        else:
            u = (t - 0.55) / 0.45
            a = u * math.pi / 2
            y = -1.4 + depth * 0.55 + math.sin(a) * 0.9
            z = -POOL_DEPTH + (1 - math.cos(a)) * height
        verts.append((bm.verts.new((-half, y, z)), bm.verts.new((half, y, z))))
    for i in range(steps):
        bm.faces.new((verts[i][0], verts[i][1], verts[i + 1][1], verts[i + 1][0]))
    bm.to_mesh(cove.data)
    bm.free()
    bpy.ops.object.shade_smooth()

    m = bpy.data.materials.new("cove")
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = (0.93, 0.945, 0.955, 1)
    b.inputs["Roughness"].default_value = 0.62
    b.inputs["Specular IOR Level"].default_value = 0.15
    cove.data.materials.append(m)
    return cove


def water(water_mat, radius=2.6):
    """
    Shallow pool. Concentric ripples radiating from the impact, decaying with
    distance so the far water settles flat and the eye goes to the bag.
    """
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=400, y_subdivisions=400, size=radius * 2)
    w = bpy.context.object
    w.name = "water"
    w.location = (0, 0, WATERLINE)

    me = w.data
    for v in me.vertices:
        r = math.hypot(v.co.x, v.co.y)
        if r < 0.16:
            continue
        decay = math.exp(-1.9 * r)
        v.co.z += math.sin(r * 46.0 - 1.2) * 0.0075 * decay
        v.co.z += math.sin(r * 19.0 + 0.4) * 0.0042 * math.exp(-0.9 * r)
    bpy.ops.object.shade_smooth()
    bpy.ops.object.modifier_add(type="SOLIDIFY")
    w.modifiers[-1].thickness = POOL_DEPTH
    w.modifiers[-1].offset = 1.0          # grow downward from the surface
    w.data.materials.append(water_mat)
    return w


def crown(foam_mat, n=34, radius=0.248, height=0.082):
    """
    The rim thrown up where the bag broke the surface. Thin curved sheets rather
    than cones, leaning outward, each one a little different so the ring does
    not read as machined.
    """
    me = bpy.data.meshes.new("crown")
    obj = bpy.data.objects.new("crown", me)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    rng = random.Random(11)

    for i in range(n):
        a = (i / n) * math.tau + rng.uniform(-0.03, 0.03)
        h = height * rng.uniform(0.55, 1.35)
        r0 = radius * rng.uniform(0.97, 1.04)
        lean = rng.uniform(0.22, 0.40)
        w0 = rng.uniform(0.016, 0.030)
        # a tapering blade: wide at the base, pinched to a tip that flicks out
        steps = 5
        prev = None
        for s in range(steps + 1):
            t = s / steps
            rr = r0 + lean * h * t
            zz = h * math.sin(t * math.pi * 0.5)
            ww = w0 * (1 - t) ** 0.8
            tang = Vector((-math.sin(a), math.cos(a), 0))
            centre = Vector((math.cos(a) * rr, math.sin(a) * rr, zz))
            l = bm.verts.new(centre - tang * ww)
            r = bm.verts.new(centre + tang * ww)
            if prev:
                bm.faces.new((prev[0], prev[1], r, l))
            prev = (l, r)

    bm.to_mesh(me)
    bm.free()
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    bpy.ops.object.modifier_add(type="SOLIDIFY")
    obj.modifiers[-1].thickness = 0.005
    bpy.ops.object.modifier_add(type="SUBSURF")
    obj.modifiers[-1].levels = 1
    obj.modifiers[-1].render_levels = 2
    me.materials.append(foam_mat)
    obj.location = (0, 0, WATERLINE)
    return obj


def droplets(water_mat, count=120, seed=5):
    """
    Ballistic spray. Launched from the crown ring on outward arcs, so the
    distribution follows a trajectory instead of filling a box.
    """
    rng = random.Random(seed)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0)
    proto = bpy.context.object
    proto.name = "droplet_proto"
    bpy.ops.object.shade_smooth()
    proto.data.materials.append(water_mat)
    proto.hide_render = True
    proto.hide_viewport = True

    coll = bpy.data.collections.new("droplets")
    bpy.context.scene.collection.children.link(coll)

    for _ in range(count):
        a = rng.random() * math.tau
        t = rng.random()
        # simple ballistic arc from the crown lip
        speed = rng.uniform(0.35, 1.0)
        r = 0.26 + speed * 0.55 * t
        z = WATERLINE + speed * 0.30 * math.sin(t * math.pi) + 0.01
        s = rng.uniform(0.0022, 0.0085) * (1.25 - 0.5 * t)
        d = proto.copy()
        d.data = proto.data
        d.hide_render = False
        d.hide_viewport = False
        d.location = (math.cos(a) * r, math.sin(a) * r, z)
        # stretch along travel: droplets in flight are not spheres
        d.scale = (s, s, s * rng.uniform(0.9, 1.45))
        d.rotation_euler = (rng.uniform(0, 0.4), rng.uniform(0, 0.4), a)
        coll.objects.link(d)
    return coll


def iv_bag(label_png, polymer, fluid_mat):
    """
    A 1-litre IV bag lying face up.

    Built as a flat welded pouch rather than a rounded box: a thin sealed flange
    around the whole perimeter, an inflated centre where the fluid sits, a
    hanger hole at the top and two moulded ports at the outlet. Those four
    features are the entire silhouette — without them a translucent rounded
    rectangle just reads as a block of ice.
    """
    W, H = BAG_W, BAG_H
    flange = 0.012

    # --- welded pouch body ---------------------------------------------------
    bpy.ops.mesh.primitive_plane_add(size=1)
    bag = bpy.context.object
    bag.name = "iv_bag"
    bag.scale = (W / 2, H / 2, 1)
    bpy.ops.object.transform_apply(scale=True)

    bm = bmesh.new()
    bm.from_mesh(bag.data)
    bmesh.ops.subdivide_edges(
        bm, edges=bm.edges[:], cuts=26, use_grid_fill=True
    )
    # round the corners and inflate the middle into a pillow
    for v in bm.verts:
        x, y = v.co.x, v.co.y
        ax, ay = abs(x) / (W / 2), abs(y) / (H / 2)
        corner = max(0.0, (ax - 0.72) / 0.28) * max(0.0, (ay - 0.66) / 0.34)
        if corner > 0:
            v.co.x *= 1 - 0.55 * corner
            v.co.y *= 1 - 0.55 * corner
        # inflation falls off to zero at the flange so the seam stays flat
        inner = max(0.0, 1 - (ax / 0.86) ** 3) * max(0.0, 1 - (ay / 0.88) ** 3)
        v.co.z += inner * (BAG_D / 2) * 1.15
    bm.to_mesh(bag.data)
    bm.free()

    bpy.ops.object.modifier_add(type="SOLIDIFY")
    sol = bag.modifiers[-1]
    sol.thickness = 0.0016          # film gauge
    sol.offset = 0.0
    bpy.ops.object.modifier_add(type="MIRROR")
    bag.modifiers[-1].use_axis = (False, False, True)   # mirror to the back face
    bpy.ops.object.modifier_add(type="SUBSURF")
    bag.modifiers[-1].levels = 1
    bag.modifiers[-1].render_levels = 2
    bpy.ops.object.shade_smooth()
    bag.data.materials.append(polymer)

    # --- fluid volume --------------------------------------------------------
    bpy.ops.mesh.primitive_plane_add(size=1)
    fluid = bpy.context.object
    fluid.name = "iv_fluid"
    fluid.scale = ((W / 2) * 0.90, (H / 2) * 0.90, 1)
    bpy.ops.object.transform_apply(scale=True)
    bmf = bmesh.new()
    bmf.from_mesh(fluid.data)
    bmesh.ops.subdivide_edges(bmf, edges=bmf.edges[:], cuts=22, use_grid_fill=True)
    for v in bmf.verts:
        ax, ay = abs(v.co.x) / ((W / 2) * 0.90), abs(v.co.y) / ((H / 2) * 0.90)
        inner = max(0.0, 1 - ax ** 3) * max(0.0, 1 - ay ** 3)
        v.co.z += inner * (BAG_D / 2) * 1.15 * 0.80
    bmf.to_mesh(fluid.data)
    bmf.free()
    bpy.ops.object.modifier_add(type="MIRROR")
    fluid.modifiers[-1].use_axis = (False, False, True)
    bpy.ops.object.modifier_add(type="SUBSURF")
    fluid.modifiers[-1].levels = 1
    fluid.modifiers[-1].render_levels = 2
    bpy.ops.object.shade_smooth()
    fluid.data.materials.append(fluid_mat)

    # --- hanger hole ---------------------------------------------------------
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.011, minor_radius=0.0028,
        location=(0, H / 2 - flange * 0.6, 0),
        major_segments=32, minor_segments=10,
    )
    hanger = bpy.context.object
    hanger.name = "hanger"
    bpy.ops.object.shade_smooth()
    hanger.data.materials.append(polymer)

    # --- outlet ports --------------------------------------------------------
    port_mat = mat_port()
    ports = []
    for i, dx in enumerate((-0.030, 0.030)):
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.0085, depth=0.044, vertices=28,
            location=(dx, -H / 2 - 0.020, 0),
            rotation=(math.radians(90), 0, 0),
        )
        pt = bpy.context.object
        pt.name = f"port_{i}"
        bpy.ops.object.modifier_add(type="BEVEL")
        pt.modifiers[-1].width = 0.0022
        pt.modifiers[-1].segments = 4
        bpy.ops.object.shade_smooth()
        pt.data.materials.append(port_mat)
        ports.append(pt)

    # --- printed label -------------------------------------------------------
    bpy.ops.mesh.primitive_plane_add(size=1)
    card = bpy.context.object
    card.name = "label"
    card.scale = (W * 0.82 / 2, H * 0.68 / 2, 1)
    bpy.ops.object.transform_apply(scale=True)
    # sits proud of the inflated face; the pillow now peaks at BAG_D/2 * 1.15
    card.location = (0, -0.004, BAG_D / 2 * 1.15 + 0.0022)
    card.data.materials.append(mat_label(label_png))
    bpy.ops.object.modifier_add(type="SIMPLE_DEFORM")
    card.modifiers[-1].deform_method = "BEND"
    card.modifiers[-1].angle = math.radians(-20)
    card.modifiers[-1].deform_axis = "Y"

    grp = bpy.data.objects.new("bag_group", None)
    bpy.context.collection.objects.link(grp)
    for ob in [bag, fluid, card, hanger, *ports]:
        ob.parent = grp
    grp.rotation_euler = (0, 0, math.radians(-8))
    grp.location = (0, 0, WATERLINE + 0.006)
    return grp


def lighting():
    """High key. Big soft top light, two rims to draw the bag's edge, low fill."""
    world = bpy.data.worlds.new("w")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (1, 1, 1, 1)
    bg.inputs["Strength"].default_value = 0.30

    def area(name, loc, rot, sx, sy, energy):
        bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
        L = bpy.context.object
        L.name = name
        L.data.shape = "RECTANGLE"
        L.data.size, L.data.size_y = sx, sy
        L.data.energy = energy
        return L

    area("key", (0.35, -0.85, 1.70), (math.radians(22), 0, math.radians(12)), 2.2, 1.4, 120)
    area("rim_l", (-0.95, 0.80, 0.34), (math.radians(76), 0, math.radians(-128)), 0.5, 0.32, 55)
    area("rim_r", (1.05, 0.66, 0.30), (math.radians(79), 0, math.radians(120)), 0.5, 0.32, 44)
    area("fill", (0, -1.5, 0.35), (math.radians(86), 0, 0), 2.4, 1.2, 18)


def camera(scene):
    bpy.ops.object.camera_add()
    cam = bpy.context.object
    cam.name = "cam"
    cam.data.lens = 80
    cam.data.sensor_width = 36
    cam.data.dof.use_dof = True
    cam.data.dof.aperture_fstop = 6.0
    scene.camera = cam

    target = bpy.data.objects.new("target", None)
    bpy.context.collection.objects.link(target)
    target.location = (0, 0, 0.035)
    con = cam.constraints.new("TRACK_TO")
    con.target = target
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    cam.data.dof.focus_object = target
    return cam


def place_topdown(cam, angle_deg, height=1.30):
    """
    Locked directly overhead, rolling about the vertical axis.

    Orbiting a camera that already sits above the subject moves it almost
    nowhere, so the shot would not appear to turn. The rotation has to come
    from rolling the camera on its own axis, which also keeps it at a true
    90-degree bird's-eye on every frame instead of drifting into a side view.
    """
    for c in list(cam.constraints):
        cam.constraints.remove(c)
    cam.location = (0, 0, height)
    cam.rotation_euler = (0, 0, math.radians(angle_deg))


def place_camera(cam, angle_deg, dist=0.90, height=0.44):
    """dist is the HORIZONTAL radius of the orbit; height is above the waterline."""
    a = math.radians(angle_deg)
    cam.location = (math.sin(a) * dist, -math.cos(a) * dist, height)


def build(label_png, samples):
    scene = reset(samples)
    wm = mat_water()
    fm = mat_foam()
    white_cove()
    water(wm)
    crown(fm)
    droplets(wm)
    iv_bag(label_png, mat_polymer(), mat_fluid())
    lighting()
    return scene, camera(scene)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["still", "orbit"], default="still")
    ap.add_argument("--label", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--samples", type=int, default=96)
    ap.add_argument("--frames", type=int, default=72)
    ap.add_argument("--arc", type=float, default=52.0)
    ap.add_argument("--start", type=float, default=-26.0)
    ap.add_argument("--angle", type=float, default=0.0)
    ap.add_argument("--dist", type=float, default=0.90)
    ap.add_argument("--camheight", type=float, default=0.44)
    ap.add_argument("--lens", type=float, default=80.0)
    ap.add_argument("--topdown", action="store_true")
    args = ap.parse_args()

    scene, cam = build(args.label, args.samples)
    cam.data.lens = args.lens
    scene.render.resolution_x = args.width
    scene.render.resolution_y = args.height
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.compression = 20

    if args.mode == "still":
        if args.topdown:
            place_topdown(cam, args.angle, args.camheight)
        else:
            place_camera(cam, args.angle, args.dist, args.camheight)
        scene.render.filepath = args.out
        bpy.ops.render.render(write_still=True)
        print("WROTE", args.out)
        return

    os.makedirs(args.out, exist_ok=True)
    for i in range(args.frames):
        t = i / max(1, args.frames - 1)
        if args.arc >= 359.0:
            e = i / args.frames        # constant rate; frame N is never a repeat of frame 0
        else:
            e = t * t * (3 - 2 * t)    # ease in/out, like a motorised slider
        if args.topdown:
            place_topdown(cam, args.start + args.arc * e, args.camheight)
        else:
            place_camera(cam, args.start + args.arc * e, args.dist, args.camheight)
        scene.render.filepath = os.path.join(args.out, f"f{i:04d}.png")
        bpy.ops.render.render(write_still=True)
        print(f"FRAME {i + 1}/{args.frames}", flush=True)


if __name__ == "__main__":
    main()

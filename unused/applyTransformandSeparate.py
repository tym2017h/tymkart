import bpy
import bmesh
bpy.ops.object.mode_set(mode='OBJECT')
for obj in bpy.data.objects:
    obj.select = True
    bpy.context.scene.objects.active=obj
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);
    try:
        bpy.ops.object.mode_set(mode='EDIT')
    except:
        continue
    bpy.ops.mesh.select_all()
    bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')
    obj.select = False
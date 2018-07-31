import bpy
import bmesh
bpy.ops.object.mode_set(mode='OBJECT')
for obj in bpy.data.objects:
    obj.select = True
    bpy.context.scene.objects.active=obj
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);
    obj.select = False
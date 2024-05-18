import { CustomFabricObject } from "@/types/type";

export const handleDelete = (
    canvas: fabric.Canvas
  ) => {
    console.log("Delete");
    console.log(canvas);
    const activeObjects = canvas.getActiveObjects();
    console.log(activeObjects);
    if (!activeObjects || activeObjects.length === 0) return;
  
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: CustomFabricObject<any>) => {
        if (!obj.objectId) return;
        canvas.remove(obj);
      });
    }
  
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };
import store from "@/store";
import { redoF, setCanvas, undoF } from "@/store/CanvasSlice";
import { ActiveElement, CustomFabricObject } from "@/types/type";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { navElements, shapeElements } from "./constants";

export const handleDelete = (canvas: fabric.Canvas) => {
  // console.log("Delete");
  console.log(canvas);
  const activeObjects = canvas.getActiveObjects();
  // console.log(canvas.getActiveObject());
  // console.log(canvas.getActiveObjects());
  if (!activeObjects || activeObjects.length === 0) return;

  if (activeObjects.length > 0) {
    activeObjects.forEach((obj: CustomFabricObject<any>) => {
      // console.log("Deleting object:", obj);
      // if (!obj.objectId) {
      //   // console.log("Object ID not found. Skipping delete operation.");
      //   return;
      // }
      canvas.remove(obj);
    });
  }

  // const newCanvasState = canvas.toJSON();
  // setCanvas(newCanvasState);
  // setCanvas(JSON.stringify(canvas));
  store.dispatch(setCanvas(JSON.stringify(canvas)));
  console.log(canvas);

  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    // Serialize the selected objects
    const serializedObjects = activeObjects.map((obj) => obj.toObject());
    // Store the serialized objects in the clipboard
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  }

  return activeObjects;
};

export const handlePaste = (canvas: fabric.Canvas) => {
  console.log("handlePaste function invoked");

  if (!canvas || !(canvas instanceof fabric.Canvas)) {
    console.error("Invalid canvas object. Aborting paste operation.");
    return;
  }

  // Retrieve serialized objects from the clipboard
  const clipboardData = localStorage.getItem("clipboard");

  if (clipboardData) {
    try {
      const parsedObjects = JSON.parse(clipboardData);

      const offset = 20;

      parsedObjects.forEach((objData: fabric.Object) => {
        fabric.util.enlivenObjects(
          [objData],
          (enlivenedObjects: fabric.Object[]) => {
            enlivenedObjects.forEach((enlivenedObj, i) => {
              enlivenedObj.set({
                left: (objData.left || 0) + offset * (i + 1),
                top: (objData.top || 0) + offset * (i + 1),
                objectId: uuidv4(),
                fill: enlivenedObj.fill,
                stroke: enlivenedObj.stroke,
              } as CustomFabricObject<any>);
              console.log("adding " + enlivenedObj);
              console.log(enlivenedObj.top, enlivenedObj.left, "top left");
              canvas.add(enlivenedObj);
            });
            canvas.renderAll();
          },
          "fabric"
        );
      });
    } catch (error) {
      console.error("Error parsing clipboard data:", error);
    }
  }
};

export const handleKeyDown = ({
  e,
  canvas,
  syncStorage,
  handleActiveElement
}: {
  e: KeyboardEvent;
  canvas: fabric.Canvas | any;
  syncStorage: () => void;
  handleActiveElement: any;
}) => {
  // Check if the key pressed is ctrl/cmd + c (copy)
  if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
    handleCopy(canvas);
    syncStorage();
  }

  // Check if the key pressed is ctrl/cmd + v (paste)
  if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
    handlePaste(canvas);
    syncStorage();
  }

  // Check if the key pressed is delete/backspace (delete)
  if (e.keyCode === 8 || e.keyCode === 46) {
    handleDelete(canvas);
    syncStorage();
  }

  // check if the key pressed is ctrl/cmd + x (cut)
  if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
    handleCopy(canvas);
    handleDelete(canvas);
    syncStorage();
  }

  if (e.ctrlKey && e.keyCode === 90) {
    store.dispatch(undoF());
    canvas.requestRenderAll();
  }

  if (e.ctrlKey && e.keyCode === 89) {
    store.dispatch(redoF());
    canvas.requestRenderAll();
  }

  if (e.keyCode === 191 && !e.shiftKey) {
    e.preventDefault();
  }

  if (e.keyCode === 84) {
    handleActiveElement(navElements.find(elem => elem.value === 'i-text'));
  }

  if (e.keyCode === 82) {
    handleActiveElement(shapeElements.find(elem => elem.value === 'rect'));
  }

  if (e.keyCode === 67 && !e?.ctrlKey) {
    handleActiveElement(shapeElements.find(elem => elem.value === 'circle'));
  }

  if (e.keyCode === 84) {
    handleActiveElement(shapeElements.find(elem => elem.value === 'triangle'));
  }

  if (e.keyCode === 76) {
    handleActiveElement(shapeElements.find(elem => elem.value === 'line'));
  }
};

import Container from "@/components/Container";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Live from "../components/Live";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { handleImageUpload } from "@/lib/shapes";
import { handleDelete, handleKeyDown } from "@/lib/key-events";

export default function Main() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const isDrawing = useRef(false);
  const selectedShapeRef = useRef<string | null>(activeElement?.name || null);

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({ canvas });
    });
  }, []);


  // const syncShapeInStorage = useMutation(({ storage }, object) => {
  //   // if the passed object is null, return
  //   if (!object) return;
  //   const { objectId } = object;

  //   /**
  //    * Turn Fabric object (kclass) into JSON format so that we can store it in the
  //    * key-value store.
  //    */
  //   const shapeData = object.toJSON();
  //   shapeData.objectId = objectId;

  //   const canvasObjects = storage.get("canvasObjects");
  //   /**
  //    * set is a method provided by Liveblocks that allows you to set a value
  //    *
  //    * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
  //    */
  //   canvasObjects.set(objectId, shapeData);
  // }, []);

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      // delete all the shapes from the canvas
      // case "reset":
      //   // clear the storage
      //   deleteAllShapes();
      //   // clear the canvas
      //   fabricRef.current?.clear();
      //   // set "select" as the active element
      //   setActiveElement(defaultNavElement);
      //   break;

      // delete the selected shape from the canvas
      // case "delete":
      //   // delete it from the canvas
      //   handleDelete(fabricRef.current as any, deleteShapeFromStorage);
      //   // set "select" as the active element
      //   setActiveElement(defaultNavElement);
      //   break;

      // upload an image to the canvas
      case "image":
        // trigger the click event on the input element which opens the file dialog
        imageInputRef.current?.click();
        /**
         * set drawing mode to false
         * If the user is drawing on the canvas, we want to stop the
         * drawing mode when clicked on the image item from the dropdown.
         */
        isDrawing.current = false;

        if (fabricRef.current) {
          // disable the drawing mode of canvas
          fabricRef.current.isDrawingMode = false;
        }
        break;

      // for comments, do nothing
      case "comments":
        break;

      default:
        // set the selected shape to the selected element
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

  return (
    <main className="h-full">
      <Container>
        <section className="flex flex-row min-h-[calc(100vh-40px)] w-full justify-between">
          <div className="w-[15%]">
            <LeftPanel
              imageInputRef={imageInputRef}
              activeElement={activeElement}
              handleImageUpload={(e: any) => {
                // prevent the default behavior of the input element
                e.stopPropagation();

                handleImageUpload({
                  file: e.target.files[0],
                  canvas: fabricRef as any,
                  shapeRef,
                });
              }}
              handleActiveElement={handleActiveElement}
            />
          </div>
          <div className="w-[70%]">
            <Live canvasRef={canvasRef} />
          </div>
          <div className="w-[15%]">
            <RightPanel />
          </div>
        </section>
      </Container>
    </main>
  );
}

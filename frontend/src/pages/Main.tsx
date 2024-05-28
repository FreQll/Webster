import Container from "@/components/Container";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Live from "../components/Live";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handleCanvaseMouseMove,
  handlePathCreated,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { handleImageUpload } from "@/lib/shapes";
import {
  handleDelete,
  //  handleDeleteObject,
  handleKeyDown,
} from "@/lib/key-events";
import { MenubarNavigation } from "@/components/MenubarNavigation";
import {
  setCanvas,
  setUndo,
  setRedo,
  updateCanvas,
  undoF,
  redoF,
  selectCanvas,
  clearAll,
} from "@/store/CanvasSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

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
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  console.log(elementAttributes, "elementAttributes");
  const isEditingRef = useRef(false);
  const activeObjectRef = useRef<fabric.Object | null>(null);

  const reduxCanvas = useSelector((state: any) => state.canvas.canvas);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(localStorage.getItem("canvas"));
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
      reduxCanvas,
      setCanvas: (canvas: any) => dispatch(setCanvas(canvas)),
    });

    // canvas.add(new fabric.IText("Tap to Type", { left: 50, top: 50 }));

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        setActiveElement,
        syncStorage,
      });
    });

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncStorage,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keydown", (e) => {
      handleKeyDown({ e, canvas: fabricRef.current, syncStorage });
    });

    if (localStorage.getItem("canvas")) {
      canvas.loadFromJSON(localStorage.getItem("canvas"), () => {
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();

      // remove the event listeners
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
    };
  }, [canvasRef]);

  const syncStorage = () => {
    console.log("SYNCING STORAGE");
    dispatch(updateCanvas(JSON.stringify(fabricRef.current)));
  };

  useEffect(() => {
    if (!reduxCanvas) {
      fabricRef.current?.clear();
      return;
    }
    fabricRef.current?.loadFromJSON(reduxCanvas, () => {
      fabricRef.current?.renderAll();
    });
  }, [reduxCanvas]);

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    console.log(elem);

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

      case "delete":
        console.log(fabricRef);
        handleDelete(fabricRef.current as fabric.Canvas);
        // setActiveElement({ name: "", value: "", icon: "" });
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

  const handleUndo = () => {
    dispatch(undoF());
  };

  const handleRedo = () => {
    dispatch(redoF());
  };

  const handleClearAll = () => {
    dispatch(clearAll());
  };

  return (
    <main className="h-full">
      <Container>
        <MenubarNavigation
          canvas={fabricRef.current}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleClearAll={handleClearAll}
        />
        <section className="flex flex-row min-h-[calc(100vh-80px)] w-full justify-between">
          <div className="w-[3%]">
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
          <div className="w-[82%]">
            <Live canvasRef={canvasRef} />
          </div>
          <div className="w-[15%]">
            <RightPanel
              elementAttributes={elementAttributes}
              setElementAttributes={setElementAttributes}
              fabricRef={fabricRef}
              isEditingRef={isEditingRef}
              activeObjectRef={activeObjectRef}
            />
          </div>
        </section>
      </Container>
    </main>
  );
}

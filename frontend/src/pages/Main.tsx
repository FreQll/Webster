import Container from "@/components/Container";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Live from "../components/Live";
import { useEffect, useRef, useState } from "react";
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
  updateCanvas,
  undoF,
  redoF,
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

  const isEditingRef = useRef(false);
  const activeObjectRef = useRef<fabric.Object | null>(null);

  const reduxCanvas = useSelector((state: any) => state.canvas.canvas);
  const dispatch = useDispatch();

  const isDragging = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const handleUndo = () => {
    dispatch(undoF());
  };

  const handleRedo = () => {
    dispatch(redoF());
  };

  const handleClearAll = () => {
    dispatch(clearAll());
  };

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
      reduxCanvas,
      setCanvas: (canvas: any) => dispatch(setCanvas(canvas)),
    });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        isDragging,
        lastPositionRef,
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
        isDragging,
        syncStorage,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        isDragging,
        lastPositionRef,
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

    const handleKeyDownWrapper = (e: KeyboardEvent) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        syncStorage,
        handleActiveElement
      });
    };

    window.addEventListener("keydown", handleKeyDownWrapper);

    if (localStorage.getItem("canvas")) {
      canvas.loadFromJSON(localStorage.getItem("canvas"), () => {
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
      window.removeEventListener("keydown", handleKeyDownWrapper);
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
    };
  }, [canvasRef]);

  const syncStorage = () => {
    dispatch(updateCanvas(JSON.stringify(fabricRef.current)));
  };

  useEffect(() => {
    if (!reduxCanvas) {
      fabricRef.current?.clear();
      fabricRef.current?.setBackgroundColor("rgb(255, 255, 255)", () => {});
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
      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      case "delete":
        handleDelete(fabricRef.current as fabric.Canvas);
        break;

      case "comments":
        break;

      default:
        selectedShapeRef.current = elem?.value as string;
        break;
    }
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
        <section className="flex flex-row min-h-[calc(100vh-40px)] w-full justify-between">
          <div className="w-[3%]">
            <LeftPanel
              imageInputRef={imageInputRef}
              activeElement={activeElement}
              handleImageUpload={(e: any) => {
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

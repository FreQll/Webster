import { CursorMode, CursorState } from "@/types/type";
import { useCallback, useState } from "react";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

const Live = ({ canvasRef }: Props) => {
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });


  const handlePointerLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
  }, []);

  const handlePointerDown = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: true }
        : state
    );
  }, [cursorState.mode, setCursorState]);

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    );
  }, [cursorState.mode, setCursorState]);

  return (
    <div
      id="canvas"
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      className="bg-gray-100 w-full h-full"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Live;

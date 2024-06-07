import { CursorMode, CursorState } from "@/types/type";
import { useCallback, useState } from "react";
import SmartBorder from "./SmartBorder";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  border_tl: { x: number; y: number };
  border_br: { x: number; y: number };
};

const Live = ({ canvasRef, border_tl, border_br }: Props) => {
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
      className="bg-white w-full h-full relative"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <SmartBorder border_tl={border_tl} border_br={border_br} />
    </div>
  );
};

export default Live;

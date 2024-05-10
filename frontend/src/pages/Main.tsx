import Container from "@/components/Container";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Live from "./Live";
import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { handleCanvasMouseDown, handleResize, initializeFabric } from '@/lib/canvas'

export default function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const isDrawing = useRef(false);
  const selectedShapeRef = useRef<string | null>('rectangle');

  useEffect(() => {
      const canvas = initializeFabric({ canvasRef, fabricRef });

      canvas.on("mouse:down", (options) => {
          handleCanvasMouseDown({
              options,
              canvas,
              isDrawing,
              shapeRef,
              selectedShapeRef
          })
      });

      window.addEventListener("resize", () => { 
          handleResize({ canvas })
      })
  }, [])

  return (
    <main className="h-full">
      <Container>
        <section className='flex flex-row h-full'>
            <LeftPanel />
            <Live canvasRef={canvasRef} />
            <RightPanel />
        </section>
      </Container>
    </main>
  );
}

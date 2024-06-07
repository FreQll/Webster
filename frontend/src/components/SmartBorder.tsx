import { fabric } from "fabric";
import { get } from "http";
import { useEffect, useState } from "react";

const SmartBorder = (props: { border_tl: { x: number; y: number }; border_br: { x: number; y: number };}) => {
  return (
    <div className="w-full h-full pointer-events-none">
      <div
        className="absolute bg-gray-300"
        style={{ top: 0, left: 0, width: props.border_tl.x, height: "100%" }}
      ></div>
      <div
        className="absolute bg-gray-300"
        style={{ top: 0, left: 0, width: "100%", height: props.border_tl.y }}
      ></div>
      {props.border_br.x !== 0 && props.border_br.y !== 0
        ? <div>
          <div
            className="absolute bg-gray-300"
            style={{ top: 0, left: props.border_br.x, width: "calc(100% - " + props.border_br.x + "px)", height: "100%" }}
          ></div>
          <div
            className="absolute bg-gray-300"
            style={{ top: props.border_br.y, left: 0, width: "100%", height: "calc(100% - " + props.border_br.y + "px)" }}
          ></div>
        </div>
        : null
      }
    </div>
  );
};

export default SmartBorder;

import axios from "@/api/axios";
import { jsPDF } from "jspdf";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const saveCanvas = async (canvas: fabric.Canvas, userId: string) => {
  const data = JSON.stringify(canvas);

  const canvasElem = document.querySelector("canvas");
  if (!canvasElem) return;
  const dataURL = canvasElem.toDataURL("image/jpg", 1.0);

  const resp = await axios.post("/canvas/create", {
    canvasJSON: data,
    userId,
    name: "Untitled",
    imageURL: dataURL,
  });

  return resp.data.id;
};

export const updateCanvasInfo = async (
  canvasJson: fabric.Canvas | string,
  canvasId: string,
  title?: string,
  desc?: string
) => {
  let data;
  if (typeof(canvasJson) == 'string') data = JSON.parse(canvasJson)
  else  data = JSON.stringify(canvasJson)

  await axios.patch(`/canvas/update/${canvasId}`, {
    canvasJSON: data,
    name: title,
    description: desc,
  });
};

export const updateCanvas = async (
  canvasJson: fabric.Canvas | string,
  canvasId: string,
  title?: string,
  desc?: string
) => {
  const data = JSON.stringify(canvasJson);

  const canvasElem = document.querySelector("canvas");
  if (!canvasElem) return;
  const dataURL = canvasElem.toDataURL("image/jpg", 1.0);

  await axios.patch(`/canvas/update/${canvasId}`, {
    canvasJSON: data,
    imageURL: dataURL,
    name: title,
    description: desc,
  });
};

export const exportToImage = (format: string) => {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  if (format === "pdf") {
    const pdf = new jsPDF("l", "px", [canvas.width, canvas.height]);
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );
    pdf.save("canvas.pdf");
    return;
  }

  const dataURL = canvas.toDataURL(`image/${format}`, 1.0);

  // get the canvas data url
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = `canvas.${format}`; // Specify the file name
  link.click();
};

export const loadFile = (canvas: fabric.Canvas | null) => {
  console.log(canvas + "canvas");
  // Clear the canvas if it exists
  if (canvas) {
    canvas.clear();
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (contents) {
        canvas?.loadFromJSON(contents, () => {
          canvas?.renderAll();
        });
      }
    };
    reader.readAsText(file);
  };

  input.click();
};

export const saveToFile = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  const data = JSON.stringify(canvas);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas.json";
  link.click();
};

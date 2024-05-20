import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportToImage = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  const dataURL = canvas.toDataURL("image/jpg", 1.0);

  // get the canvas data url
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas.jpg"; // Specify the file name
  link.click();
};

export const loadFile = (canvas: fabric.Canvas) => {
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

export const saveToFile = (canvas: fabric.Canvas) => {
  const data = JSON.stringify(canvas);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas.json";
  link.click();
};

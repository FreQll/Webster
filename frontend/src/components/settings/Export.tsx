import { exportToImage } from "@/lib/utils";
import { Button } from "../ui/button";

export const Export = () => {
  return (
    <div>
      <Button onClick={exportToImage}>Export</Button>
    </div>
  );
};

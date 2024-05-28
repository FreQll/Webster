import { ShapesMenuProps } from "@/types/type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ShapesIcon } from "lucide-react";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <img
            src={isDropdownElem ? activeElement.icon : item.icon}
            alt={item.name}
            className={isDropdownElem ? "" : "invert "}
            width={20}
            height={20}
          />
          {/* <ShapesIcon
            className="w-[20px] h-[20px]"
            onClick={() => handleActiveElement(item)}
          /> */}
        </DropdownMenuTrigger>

        <DropdownMenuContent className=" flex flex-col gap-y-1 border-none   py-4 text-white bg-gray-100">
          {item.value.map((elem) => (
            <Button
              key={elem?.name}
              onClick={() => {
                handleActiveElement(elem);
              }}
              className={` transition-colors flex h-fit justify-between gap-10 rounded-none bg-gray-100 px-5 py-3 focus:border-none ${
                activeElement.value === elem?.value
                  ? "bg-gray-500"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="group flex items-center gap-2">
                <img
                  src={elem?.icon as string}
                  alt={elem?.name as string}
                  width={24}
                  height={24}
                  className={
                    activeElement.value === elem?.value ? "invert" : ""
                  }
                />
                <p
                  className={`text-sm  ${
                    activeElement.value === elem?.value
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  {elem?.name}
                </p>
              </div>
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;

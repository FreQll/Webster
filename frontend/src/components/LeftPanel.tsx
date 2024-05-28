import { navElements } from "@/helper/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import ShapesMenu from "./ShapesMenu";
import { NewThread } from "./NewThread";
import { Button } from "./ui/button";

const LeftPanel = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <div className="flex flex-col border-t sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20 bg-gray-200 text-white fill-white">
      <ul className="flex flex-col">
        {navElements.map((item: ActiveElement | any) => (
          <li
            key={item.name}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
            }}
            className={`group px-2.5 py-5 flex justify-center items-center w-full h-full cursor-pointer
            ${
              isActive(item.value) ? "bg-gray-500" : "hover:bg-primary-grey-200"
            }
            `}
          >
            {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={item}
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleActiveElement={handleActiveElement}
                handleImageUpload={handleImageUpload}
              />
            ) : item?.value === "comments" ? (
              // If value is comments, trigger the NewThread component
              <NewThread>
                <img
                  src={item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className={isActive(item.value) ? "invert" : ""}
                />
              </NewThread>
            ) : (
              <img
                src={item.icon}
                alt={item.name}
                width={20}
                height={20}
                className={isActive(item.value) ? " " : "invert"}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftPanel;

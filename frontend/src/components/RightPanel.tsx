import { modifyShape } from "@/lib/shapes";
import { RightSidebarProps } from "@/types/type";
import React, { useEffect, useMemo, useRef } from "react";
import Text from "./settings/Text";
import { Color } from "./settings/Color";
// import { Export } from "./settings/Export";

const RightPanel = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
    });

    fabricRef.current?.renderAll();
  };

  // useEffect(() => {
  //   console.log(elementAttributes);
  // }, [elementAttributes]);

  const memoizedContent = useMemo(
    () => (
      <div className="bg-gray-100 flex flex-col sticky right-0 h-full max-sm:hidden min-w-[227px] select-none overflow-y-auto pb-20">
        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          attributeType="fill"
          placeholder="color"
          handleInputChange={handleInputChange}
        />
        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          placeholder="stroke"
          attributeType="stroke"
          handleInputChange={handleInputChange}
        />
        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />
        {/* <Export /> */}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elementAttributes]
  );

  return memoizedContent;
};

export default RightPanel;

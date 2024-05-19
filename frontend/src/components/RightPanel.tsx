import { modifyShape } from "@/lib/shapes";
import { RightSidebarProps } from "@/types/type";
import React, { useEffect, useMemo, useRef } from "react";
import Color from "./settings/Color";
import Text from "./settings/Text";

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

    console.log(elementAttributes);

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
    });

    fabricRef.current?.renderAll();
  };

  useEffect(() => {
    console.log(elementAttributes);
  }, [elementAttributes]);

  const memoizedContent = useMemo(
    () => (
      <div className="bg-gray-100 flex flex-col border-t sticky right-0 h-full max-sm:hidden min-w-[227px] select-none overflow-y-auto pb-20">
        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />
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
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elementAttributes]
  );

  return memoizedContent;
};

export default RightPanel;

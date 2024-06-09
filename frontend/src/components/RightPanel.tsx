import { modifyShape } from "@/lib/shapes";
import { RightSidebarProps } from "@/types/type";
import { useRef } from "react";
import Text from "./settings/Text";
import { Color } from "./settings/Color";
import { useDispatch } from "react-redux";
import { updateCanvas } from "@/store/CanvasSlice";
import { Filters } from "./settings/Filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectUser } from "@/store/UserSlice";
import { useSelector } from "react-redux";

const RightPanel = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
}: RightSidebarProps) => {
  const user = useSelector(selectUser);
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const dispatch = useDispatch(); // Move useDispatch to the top level of the component

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
    dispatch(updateCanvas(JSON.stringify(fabricRef.current)));
  };

  return (
    <div className="absolute r-0 bg-gray-100 flex flex-col right-0 h-full max-sm:hidden min-w-[227px] select-none overflow-y-auto pb-20">
      <Tabs defaultValue="properties">
        <TabsList className="w-full">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          {user.id && (
            <TabsTrigger value="filters">Filters</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="properties">
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
        </TabsContent>
        <TabsContent value="filters">
          <Filters canvas={fabricRef.current} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;

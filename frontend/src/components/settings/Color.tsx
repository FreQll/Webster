import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { HexColorPicker } from "react-colorful";

type Props = {
  inputRef: any;
  attribute: string;
  placeholder: string;
  attributeType: string;
  handleInputChange: (property: string, value: string) => void;
};

export const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
}: Props) => {
  const [color, setColor] = useState<string>(attribute);

  // useEffect(() => {
  //   handleInputChange(attributeType, color);
  // }, [color]);

  const handleColorChange = (color: string) => {
    setColor(color);
    handleInputChange(attributeType, color);
  };

  // console.log(attribute, color, "color");

  return (
    <div className="flex flex-col gap-3  p-5">
      <h3 className="text-[12px] uppercase">{placeholder}</h3>
      <div
        className="flex items-center gap-2 "
        onClick={() => inputRef.current.click()}
      >
        {/* <input
          type="color"
          value={attribute}
          ref={inputRef}
          onChange={(e) => handleInputChange(attributeType, e.target.value)}
        /> */}
        <div ref={inputRef}>
          <HexColorPicker color={attribute} onChange={handleColorChange} />
        </div>
        {/* <Label className="flex-1">{attribute}</Label>
      <Label className="flex h-6 w-8 items-center justify-center bg-primary-grey-100 text-[10px] leading-3">
        90%
      </Label> */}
      </div>
    </div>
  );
};

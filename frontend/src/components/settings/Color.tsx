import { useState } from "react";
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
  // const [color, setColor] = useState<string>(attribute);

  // useEffect(() => {
  //   handleInputChange(attributeType, color);
  // }, [color]);

  const handleColorChange = (color: string) => {
    // setColor(color);
    handleInputChange(attributeType, color);
  };

  // console.log(attribute, color, "color");

  return (
    <div className="flex flex-col gap-3  p-5">
      <h3 className="text-[12px] uppercase">{placeholder}</h3>
      <div
        className="flex items-center gap-2 w-full"
        onClick={() => inputRef.current.click()}
      >
        <div className="w-full" ref={inputRef}>
          <HexColorPicker
            className="w-full"
            color={attribute}
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

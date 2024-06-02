import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

type FilterControlProps = {
  filterName: string;
  filterIndex: number;
  filterInstance: any;
  canvas: any;
  onValueChange: (index: string, value: any) => void;
  value: number;
  min: number;
  max: number;
  step: number;
  isSlider?: boolean;
};

export const FilterControl = ({
  filterName,
  filterIndex,
  filterInstance,
  canvas,
  onValueChange,
  value,
  min,
  max,
  step,
  isSlider = true,
}: FilterControlProps) => {
  const [isActive, setIsActive] = useState(false);

  const applyFilter = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      if (isActive) {
        obj.filters[filterIndex] = new filterInstance({
          [filterName.toLowerCase()]: value,
        });
      } else {
        obj.filters[filterIndex] = undefined;
      }
      obj.applyFilters();
      canvas.renderAll();
    }
  };

  useEffect(() => {
    applyFilter();
  }, [isActive, value, filterIndex, filterInstance, canvas]);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
  };

  const handleSliderChange = (value: number[]) => {
    onValueChange(filterName.toLowerCase(), value[0]);
  };

  return (
    <div className="flex flex-row justify-between gap-2 my-3 items-center">
      <div className="flex flex-row justify-between gap-1 items-center">
        <Checkbox
          defaultChecked={false}
          onCheckedChange={handleToggle}
          id={filterName}
        />
        <Label htmlFor={filterName} className=" cursor-pointer">
          {filterName}
        </Label>
      </div>

      {isSlider && (
        <Slider
          defaultValue={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="mt-2"
        />
      )}
    </div>
  );
};

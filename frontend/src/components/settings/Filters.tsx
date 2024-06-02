import { useState } from "react";
import { fabric } from "fabric";
import { FilterControl } from "./FilterControl";

type FiltersProps = {
  canvas: any;
};

export const Filters = ({ canvas }: FiltersProps) => {
  const [filters, setFilters] = useState({
    pixelate: 0,
    invert: 0,
    sepia: 0,
    grayscale: 0,
    vibrance: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    noise: 0,
    blur: 0,
  });

  console.log(filters);

  const handleValueChange = (index: string, value: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [index]: value,
    }));
  };

  return (
    <div className="mx-2">
      <FilterControl
        filterName="Pixelate"
        filterIndex={0}
        filterInstance={fabric.Image.filters.Pixelate}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.pixelate}
        min={0}
        max={100}
        step={1}
        isSlider={false}
      />
      <FilterControl
        filterName="Black & White"
        filterIndex={1}
        filterInstance={fabric.Image.filters.Grayscale}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.grayscale}
        min={0}
        max={1}
        step={1}
        isSlider={false}
      />
      <FilterControl
        filterName="Sepia"
        filterIndex={2}
        filterInstance={fabric.Image.filters.Sepia}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.sepia}
        min={1}
        max={1}
        step={1}
        isSlider={false}
      />
      <FilterControl
        filterName="Invert"
        filterIndex={3}
        filterInstance={fabric.Image.filters.Invert}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.invert}
        min={0}
        max={1}
        step={1}
      />
      <FilterControl
        filterName="Vibrance"
        filterIndex={4}
        filterInstance={fabric.Image.filters.Vibrance}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.vibrance}
        min={-1}
        max={1}
        step={0.1}
      />
      <FilterControl
        filterName="Brightness"
        filterIndex={5}
        filterInstance={fabric.Image.filters.Brightness}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.brightness}
        min={-1}
        max={1}
        step={0.1}
      />
      <FilterControl
        filterName="Contrast"
        filterIndex={6}
        filterInstance={fabric.Image.filters.Contrast}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.contrast}
        min={-1}
        max={1}
        step={0.1}
      />
      <FilterControl
        filterName="Saturation"
        filterIndex={7}
        filterInstance={fabric.Image.filters.Saturation}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.saturation}
        min={-1}
        max={1}
        step={0.1}
      />
      <FilterControl
        filterName="Blur"
        filterIndex={8}
        filterInstance={fabric.Image.filters.Blur}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.blur}
        min={0}
        max={1}
        step={0.01}
      />
      <FilterControl
        filterName="Noise"
        filterIndex={9}
        filterInstance={fabric.Image.filters.Noise}
        canvas={canvas}
        onValueChange={handleValueChange}
        value={filters.noise}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
};

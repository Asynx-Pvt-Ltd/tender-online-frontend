import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TenderValueSliderProps {
  selectedTenderValues: string[];
  setSelectedTenderValues: (values: string[]) => void;
}

const TenderValueSlider = ({
  selectedTenderValues,
  setSelectedTenderValues,
}: TenderValueSliderProps) => {
  const breakpoints = [
    { value: "1", label: "Less than ₹10L" },
    { value: "2", label: "₹10L - ₹1Cr" },
    { value: "3", label: "₹1Cr - ₹100Cr" },
    { value: "4", label: "₹100Cr - ₹500Cr" },
    { value: "null", label: "Refer the Document" },
  ];

  const getCurrentValueIndex = () => {
    if (selectedTenderValues.length === 0) return 0;
    const currentValue = selectedTenderValues[0];
    const index = breakpoints.findIndex((bp) => bp.value === currentValue);
    return index >= 0 ? index : 0;
  };

  const [sliderValue, setSliderValue] = useState<number>(
    getCurrentValueIndex()
  );

  React.useEffect(() => {
    setSliderValue(getCurrentValueIndex());
  }, [selectedTenderValues]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const handleApply = () => {
    setSelectedTenderValues([breakpoints[sliderValue].value]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-[5.3vh] px-3 text-sm rounded-md border-gray-300 ${
            selectedTenderValues.length > 0 ? "border-black text-black" : ""
          }`}
        >
          Tender Value
          {selectedTenderValues.length > 0 && (
            <span className="ml-2 bg-gray-200 text-black text-xs font-medium rounded-full px-2 py-0.5">
              {selectedTenderValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-white shadow-lg border border-gray-200 rounded-md">
        <div className="space-y-4">
          <Label className="text-xs font-medium text-gray-700">
            Select Tender Value Range
          </Label>
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-black transition-all duration-300"
              style={{
                width: `${(sliderValue / (breakpoints.length - 1)) * 100}%`,
              }}
            ></div>
            <Slider
              value={[sliderValue]}
              max={breakpoints.length - 1}
              step={1}
              onValueChange={handleSliderChange}
              className="relative z-10 w-full h-2"
            />
          </div>
          <div className="text-center font-medium text-gray-800 text-sm">
            {breakpoints[sliderValue].label}
          </div>
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white h-8 text-sm rounded-md"
            onClick={handleApply}
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TenderValueSlider;

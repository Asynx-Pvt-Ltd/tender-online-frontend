"use client";

import React, { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MultiSelect } from "@mantine/core";
import { Bookmark, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "../shared/multi-select-demo";

interface TenderFiltersProps {
  selectedDistricts: string[];
  selectedTenderValues: string[];
  industry: string[];
  classification: string[];
  dateRange: any;
  setSelectedDistricts: (districts: string[]) => void;
  setSelectedTenderValues: (values: string[]) => void;
  setIndustry: (industry: string[]) => void;
  setClassification: (classification: string[]) => void;
  setDateRange: (range: any) => void;
  clearFilters: () => void;
  dropdownData: any;
  foryou: boolean;
}
type DistrictMapping = {
  [key: string]: string[];
};
const districtMapping: DistrictMapping = {
  tiruvallur: ["Tiruvallur", "Thiruvallur"],
  thiruvallur: ["Tiruvallur", "Thiruvallur"],
};
const handleSavedClick = (event: MouseEvent<HTMLButtonElement>) => {
  // Prevent default behavior if necessary
  event.preventDefault();
  // Redirect to the desired location
  window.location.href = "/profile/saved";
};

export default function TenderFilters({
  selectedDistricts,
  selectedTenderValues,
  industry,
  classification,
  dateRange,
  setSelectedDistricts,
  setSelectedTenderValues,
  setIndustry,
  setClassification,
  setDateRange,
  clearFilters,
  dropdownData,
  foryou,
}: TenderFiltersProps) {
  const handleMultiSelectChange = (label: string, value: any) => {
    switch (label) {
      case "District":
        const newDistricts = value.flatMap((district: string) => {
          return districtMapping[district] || [district];
        });
        setSelectedDistricts(newDistricts);
        break;
      case "Industry":
        setIndustry(value);
        break;
      case "Classification":
        setClassification(value);
        break;
      case "Tender Value":
        setSelectedTenderValues(value);
        break;
      default:
        break;
    }
  };

  const removeDuplicates = (options: { value: string; label: string }[]) => {
    const uniqueOptions = new Map();
    options.forEach((option) => {
      if (!uniqueOptions.has(option.value)) {
        uniqueOptions.set(option.value, option);
      }
    });
    return Array.from(uniqueOptions.values());
  };

  const renderMultiSelect = (label: string) => {
    let options =
      dropdownData[label]?.map((option: any) => ({
        value: option.value,
        label: option.label,
        disabled:
          label === "Industry"
            ? option.label.toLowerCase() !== "construction"
            : false,
      })) || [];

    const uniqueOptions = removeDuplicates(options);

    const getSelectedValues = (label: string) => {
      switch (label) {
        case "District":
          return Array.isArray(selectedDistricts) ? selectedDistricts : [];
        case "Tender Value":
          return Array.isArray(selectedTenderValues)
            ? selectedTenderValues
            : [];
        case "Industry":
          return Array.isArray(industry) ? industry : [];
        case "Classification":
          return Array.isArray(classification) ? classification : [];
        default:
          return [];
      }
    };

    return (
      <div className="w-fit mx-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{label}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 bg-white">
            <div className="grid gap-4">
              <MultiSelect
                label={label}
                searchable
                placeholder={`Pick ${label}`}
                data={uniqueOptions}
                value={getSelectedValues(label)}
                onChange={(selected) =>
                  handleMultiSelectChange(label, selected)
                }
                className={cn("basic-multi-select")}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const dropdownLabels = [
    "District",
    "Tender Value",
    "Industry",
    "Classification",
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
        {dropdownLabels.map((label) => renderMultiSelect(label))}
        <div className="">
          <DatePickerWithRange
            setDateRange={setDateRange}
            dateRange={dateRange}
          />
        </div>
      </div>{" "}
    </div>
  );
}

export const FilterLabels = ({
  selectedDistricts,
  selectedTenderValues,
  industry,
  classification,
  dateRange,
  setSelectedDistricts,
  setSelectedTenderValues,
  setIndustry,
  setClassification,
  setDateRange,
  clearFilters,
  dropdownData,
  foryou,
}: TenderFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 ml-2 mt-2">
      {(selectedDistricts.length > 0 ||
        selectedTenderValues.length > 0 ||
        dateRange ||
        industry.length > 0 ||
        classification) && (
        <button
          onClick={clearFilters}
          className="px-4 rounded-md border py-2 text-xs bg-white hover:bg-gray-100"
        >
          Reset All
        </button>
      )}
      <button
        className="flex items-center gap-1 px-4 rounded-md border py-2 text-xs bg-white hover:bg-gray-100"
        onClick={handleSavedClick}
      >
        <Bookmark className="h-5 w-5 text-gray-400" />
        Saved Tenders
      </button>
      {selectedDistricts?.map((district: string) => (
        <FilterTag
          key={district}
          label={district}
          type="district"
          onRemove={() => {
            setSelectedDistricts(
              selectedDistricts.filter((d) => d !== district)
            );
          }}
        />
      ))}
      {dateRange && (
        <FilterTag
          label={`${dateRange?.startDate?.toLocaleDateString() ?? ""} - ${
            dateRange?.endDate?.toLocaleDateString() ?? ""
          }`}
          type="date range"
          onRemove={() => setDateRange(null)}
        />
      )}
      {selectedTenderValues?.map((value: string) => {
        console.log("Current Value:", value);
        const tender = dropdownData["Tender Value"].find(
          (item: any) => item.value === value
        );
        return (
          tender && (
            <FilterTag
              key={value}
              label={tender.label}
              type="tender value"
              onRemove={() => {
                setSelectedTenderValues(
                  selectedTenderValues.filter((v) => v !== value)
                );
              }}
            />
          )
        );
      })}
      {industry?.map((ind: string) => (
        <FilterTag
          key={ind}
          label={ind}
          type="industry"
          onRemove={() => {
            setIndustry(industry.filter((i) => i !== ind));
          }}
        />
      ))}
      {classification?.map((cls: string) => (
        <FilterTag
          key={cls}
          label={cls}
          type="classification"
          onRemove={() => {
            setClassification(classification.filter((c) => c !== cls));
          }}
        />
      ))}
    </div>
  );
};

interface FilterTagProps {
  label: string;
  type: string;
  onRemove: () => void;
}

function FilterTag({ label, type, onRemove }: FilterTagProps) {
  return (
    <div className="mr-2 capitalize flex flex-col items-start px-3 pr-6 py-1 border text-xs rounded-md relative">
      {label}
      <span className="text-[8px] font-light">{type}</span>
      <button
        onClick={onRemove}
        className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

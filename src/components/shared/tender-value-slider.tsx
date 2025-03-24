import React, { useState, useEffect } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TenderValueEnum } from '@/enums';
import { Checkbox } from '../ui/checkbox';

interface TenderValueSliderProps {
	selectedTenderValues: [number, number] | TenderValueEnum.REFERTHEDOCUMENT;
	setSelectedTenderValues: (
		values: [number, number] | TenderValueEnum.REFERTHEDOCUMENT,
	) => void;
}

const TenderValueSlider = ({
	selectedTenderValues,
	setSelectedTenderValues,
}: TenderValueSliderProps) => {
	// Min and max values in crores
	const MIN_VALUE = 0;
	const MAX_VALUE = 500;

	// Default range
	const defaultRange: [number, number] = [MIN_VALUE, MAX_VALUE];

	// Initialize state with selected values or defaults
	const [sliderRange, setSliderRange] = useState<[number, number]>(
		Array.isArray(selectedTenderValues) && selectedTenderValues?.length === 2
			? selectedTenderValues
			: defaultRange,
	);

	// Update slider when selected values change externally
	useEffect(() => {
		if (selectedTenderValues?.length === 2) {
			if (Array.isArray(selectedTenderValues)) {
				setSliderRange(selectedTenderValues);
			}
		}
	}, [selectedTenderValues]);

	// Handle slider value changes
	const handleSliderChange = (values: number[]) => {
		setSliderRange([values[0], values[1]]);
	};

	// Apply the selected range
	const handleApply = () => {
		setSelectedTenderValues(sliderRange);
	};

	// const formatCurrency = (value: number) => {
	// 	return `₹${value.toFixed(value < 10 ? 1 : 0)}L`;
	// };
	// Format currency values
	const formatCurrency = (value: number) => {
		if (value < 1) {
			// Convert to lakhs if less than 1 crore
			return `₹${(value * 100).toFixed(value < 0.1 ? 2 : 0)}L`;
		} else {
			return `₹${value.toFixed(value < 10 ? 1 : 0)}Cr`;
		}
	};

	// Create display text for the selected range
	const getDisplayRange = () => {
		return `${formatCurrency(sliderRange[0])} to ${formatCurrency(
			sliderRange[1],
		)}`;
	};

	// Calculate if any filter is active
	const isFilterActive =
		selectedTenderValues?.length === 2 &&
		Array.isArray(selectedTenderValues) &&
		(selectedTenderValues[0] > MIN_VALUE ||
			selectedTenderValues[1] < MAX_VALUE);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={`h-[5.3vh] px-3 text-sm rounded-md border-gray-300 ${
						isFilterActive ? 'border-black text-black' : ''
					}`}
				>
					Tender Value
					{isFilterActive && (
						<span className="ml-2 bg-gray-200 text-black text-xs font-medium rounded-full px-2 py-0.5">
							1
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-4 bg-white shadow-lg border border-gray-200 rounded-md">
				<div className="space-y-4">
					<Label className="text-xs font-medium text-gray-700">
						Select Tender Value Range (₹0 - ₹500Cr)
					</Label>

					{/* Custom Slider with visible handles */}
					<div className="relative w-full h-6 mt-2">
						{/* Background track */}
						<div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>

						{/* Colored range bar */}
						<div
							className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-black rounded-full"
							style={{
								left: `${(sliderRange[0] / MAX_VALUE) * 100}%`,
								width: `${
									((sliderRange[1] - sliderRange[0]) / MAX_VALUE) * 100
								}%`,
							}}
						></div>

						{/* Left handle */}
						<div
							className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-black cursor-pointer shadow-md z-20"
							style={{
								left: `${(sliderRange[0] / MAX_VALUE) * 100}%`,
							}}
						></div>

						{/* Right handle */}
						<div
							className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-black cursor-pointer shadow-md z-20"
							style={{
								left: `${(sliderRange[1] / MAX_VALUE) * 100}%`,
							}}
						></div>

						{/* Actual slider (invisible but functional) */}
						<Slider
							value={[sliderRange[0], sliderRange[1]]}
							min={MIN_VALUE}
							max={MAX_VALUE}
							step={0.1}
							onValueChange={handleSliderChange}
							className="absolute inset-0 opacity-0 z-30 cursor-pointer"
						/>
					</div>
					<div className="flex items-center gap-2 justify-center">
						Refer the Document{' '}
						<Checkbox
							checked={
								selectedTenderValues === TenderValueEnum.REFERTHEDOCUMENT
							}
							onCheckedChange={(checked) => {
								setSelectedTenderValues(
									checked
										? TenderValueEnum.REFERTHEDOCUMENT
										: [MIN_VALUE, MAX_VALUE],
								);
							}}
						/>
					</div>
					<div className="flex justify-between text-xs text-gray-500 mt-1">
						<span>₹0</span>
						<span>₹500Cr</span>
					</div>
					<div className="text-center font-medium text-gray-800 text-sm">
						{getDisplayRange()}
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

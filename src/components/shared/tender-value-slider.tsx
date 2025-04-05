import React, { useState, useEffect, useRef } from 'react';
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
import { Input } from '@/components/ui/input';

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

	const defaultRange: [number, number] = [MIN_VALUE, MAX_VALUE];

	const [open, setOpen] = useState(false);

	const [sliderRange, setSliderRange] = useState<[number, number]>(
		Array.isArray(selectedTenderValues) && selectedTenderValues?.length === 2
			? selectedTenderValues
			: defaultRange,
	);

	const [minInputValue, setMinInputValue] = useState<string>(
		Array.isArray(selectedTenderValues) && selectedTenderValues[0] < 1
			? (selectedTenderValues[0] * 100).toFixed(2)
			: selectedTenderValues[0]?.toString() || '0',
	);
	const [maxInputValue, setMaxInputValue] = useState<string>(
		Array.isArray(selectedTenderValues)
			? selectedTenderValues[1]?.toString() || '500'
			: '500',
	);

	const [minUnit, setMinUnit] = useState<'L' | 'Cr'>(
		Array.isArray(selectedTenderValues) && selectedTenderValues[0] < 1
			? 'L'
			: 'Cr',
	);
	const [maxUnit, setMaxUnit] = useState<'L' | 'Cr'>('Cr');

	const [referDocument, setReferDocument] = useState<boolean>(
		selectedTenderValues === TenderValueEnum.REFERTHEDOCUMENT,
	);

	useEffect(() => {
		if (
			Array.isArray(selectedTenderValues) &&
			selectedTenderValues?.length === 2
		) {
			setSliderRange(selectedTenderValues);

			setMinInputValue(
				selectedTenderValues[0] < 1
					? (selectedTenderValues[0] * 100).toFixed(2)
					: selectedTenderValues[0].toString(),
			);
			setMaxInputValue(selectedTenderValues[1].toString());

			setMinUnit(selectedTenderValues[0] < 1 ? 'L' : 'Cr');
			setMaxUnit('Cr');
		} else if (selectedTenderValues === TenderValueEnum.REFERTHEDOCUMENT) {
			setReferDocument(true);
		} else {
			setReferDocument(false);
		}
	}, [selectedTenderValues]);

	const handleSliderChange = (values: number[]) => {
		const newRange: [number, number] = [values[0], values[1]];
		setSliderRange(newRange);

		setMinInputValue(
			newRange[0] < 1 ? (newRange[0] * 100).toFixed(2) : newRange[0].toString(),
		);
		setMaxInputValue(newRange[1].toString());

		setMinUnit(newRange[0] < 1 ? 'L' : 'Cr');
		setMaxUnit('Cr');
	};

	const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMinInputValue(e.target.value);
	};

	const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMaxInputValue(e.target.value);
	};

	const toggleMinUnit = () => {
		if (minUnit === 'Cr') {
			setMinUnit('L');
			setMinInputValue((parseFloat(minInputValue) * 100).toFixed(2));
		} else {
			setMinUnit('Cr');
			setMinInputValue((parseFloat(minInputValue) / 100).toFixed(2));
		}
	};

	const toggleMaxUnit = () => {
		if (maxUnit === 'Cr') {
			setMaxUnit('L');
			setMaxInputValue((parseFloat(maxInputValue) * 100).toFixed(2));
		} else {
			setMaxUnit('Cr');
			setMaxInputValue((parseFloat(maxInputValue) / 100).toFixed(2));
		}
	};

	const handleApply = () => {
		let minValue = parseFloat(minInputValue);
		let maxValue = parseFloat(maxInputValue);

		if (minUnit === 'L') minValue = minValue / 100;
		if (maxUnit === 'L') maxValue = maxValue / 100;

		minValue = Math.max(0, Math.min(minValue, MAX_VALUE));
		maxValue = Math.max(minValue, Math.min(maxValue, MAX_VALUE));

		if (referDocument) {
			setSelectedTenderValues(TenderValueEnum.REFERTHEDOCUMENT);
		} else {
			setSelectedTenderValues([minValue, maxValue]);
		}

		setSliderRange([minValue, maxValue]);

		setOpen(false);
	};

	const formatCurrency = (value: number) => {
		if (value < 1) {
			return `₹${(value * 100).toFixed(value < 0.1 ? 2 : 0)}L`;
		} else {
			return `₹${value.toFixed(value < 10 ? 1 : 0)}Cr`;
		}
	};

	const getDisplayRange = () => {
		if (referDocument) {
			return 'Refer the Document';
		}
		return `${formatCurrency(sliderRange[0])} to ${formatCurrency(
			sliderRange[1],
		)}`;
	};

	const isFilterActive =
		(selectedTenderValues?.length === 2 &&
			Array.isArray(selectedTenderValues) &&
			(selectedTenderValues[0] > MIN_VALUE ||
				selectedTenderValues[1] < MAX_VALUE)) ||
		selectedTenderValues === TenderValueEnum.REFERTHEDOCUMENT;

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
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
								disabled={referDocument}
							/>
						</div>

						{/* Custom input fields for min and max values */}
						<div className="flex items-center justify-between mt-4">
							<div className="w-[45%]">
								<Label className="text-xs font-medium text-gray-700 mb-1 block">
									Min Value
								</Label>
								<div className="flex">
									<Input
										type="number"
										value={minInputValue}
										onChange={handleMinInputChange}
										className="w-full text-xs rounded-r-none"
										disabled={referDocument}
										min="0"
									/>
									<Button
										type="button"
										onClick={toggleMinUnit}
										className="rounded-l-none border border-l-0 h-9 px-2 bg-black hover:bg-gray-800 text-white"
										disabled={referDocument}
									>
										{minUnit}
									</Button>
								</div>
							</div>
							<div className="w-[45%]">
								<Label className="text-xs font-medium text-gray-700 mb-1 block">
									Max Value
								</Label>
								<div className="flex">
									<Input
										type="number"
										value={maxInputValue}
										onChange={handleMaxInputChange}
										className="w-full text-xs rounded-r-none"
										disabled={referDocument}
										min="0"
									/>
									<Button
										type="button"
										onClick={toggleMaxUnit}
										className="rounded-l-none border border-l-0 h-9 px-2 bg-black hover:bg-gray-800 text-white"
										disabled={referDocument}
									>
										{maxUnit}
									</Button>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 justify-center">
							<Checkbox
								id="referDocument"
								checked={referDocument}
								onCheckedChange={(checked) => {
									setReferDocument(checked as boolean);
								}}
							/>
							<Label htmlFor="referDocument" className="text-sm cursor-pointer">
								Refer the Document
							</Label>
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
		</div>
	);
};

export default TenderValueSlider;

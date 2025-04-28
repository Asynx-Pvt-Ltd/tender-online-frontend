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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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

	const handleMinUnitChange = (value: 'L' | 'Cr') => {
		if (value !== minUnit) {
			if (value === 'L') {
				setMinInputValue((parseFloat(minInputValue) * 100).toFixed(2));
			} else {
				setMinInputValue((parseFloat(minInputValue) / 100).toFixed(2));
			}
			setMinUnit(value);
		}
	};

	const handleMaxUnitChange = (value: 'L' | 'Cr') => {
		if (value !== maxUnit) {
			if (value === 'L') {
				setMaxInputValue((parseFloat(maxInputValue) * 100).toFixed(2));
			} else {
				setMaxInputValue((parseFloat(maxInputValue) / 100).toFixed(2));
			}
			setMaxUnit(value);
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
						className={`h-10 px-4 text-sm font-medium rounded-md border
						}`}
					>
						Tender Value
						{isFilterActive && (
							<span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
								1
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80 p-5 bg-white shadow-lg border border-gray-200 rounded-lg">
					<div className="space-y-5">
						<div>
							<Label className="text-sm font-semibold text-gray-800 block mb-1">
								Select Tender Value Range (₹0 - ₹500Cr)
							</Label>
							{/* {!referDocument && (
								<div className="relative w-full h-8 mt-4 mb-6">
									<div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
									<div
										className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-full"
										style={{
											left: `${(sliderRange[0] / MAX_VALUE) * 100}%`,
											width: `${
												((sliderRange[1] - sliderRange[0]) / MAX_VALUE) * 100
											}%`,
										}}
									></div>
									<div
										className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-2 border-blue-600 cursor-pointer shadow-md z-20"
										style={{
											left: `${(sliderRange[0] / MAX_VALUE) * 100}%`,
										}}
									></div>
									<div
										className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-2 border-blue-600 cursor-pointer shadow-md z-20"
										style={{
											left: `${(sliderRange[1] / MAX_VALUE) * 100}%`,
										}}
									></div>
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
							)} */}
						</div>

						<div className="flex items-start justify-between gap-4">
							<div className="w-1/2">
								<Label className="text-xs font-medium text-gray-700 mb-1.5 block">
									Min Value
								</Label>
								<div className="flex gap-1">
									<Input
										type="number"
										value={minInputValue}
										onChange={handleMinInputChange}
										className="w-full text-sm rounded-r-none h-10"
										disabled={referDocument}
										min="0"
									/>
									<Select
										value={minUnit}
										onValueChange={(value) =>
											handleMinUnitChange(value as 'L' | 'Cr')
										}
										disabled={referDocument}
									>
										<SelectTrigger className="w-16 h-10 rounded-l-none border-l-0 bg-gray-50">
											<SelectValue placeholder={minUnit} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="L">L</SelectItem>
											<SelectItem value="Cr">Cr</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="w-1/2">
								<Label className="text-xs font-medium text-gray-700 mb-1.5 block">
									Max Value
								</Label>
								<div className="flex gap-1">
									<Input
										type="number"
										value={maxInputValue}
										onChange={handleMaxInputChange}
										className="w-full text-sm rounded-r-none h-10"
										disabled={referDocument}
										min="0"
									/>
									<Select
										value={maxUnit}
										onValueChange={(value) =>
											handleMaxUnitChange(value as 'L' | 'Cr')
										}
										disabled={referDocument}
									>
										<SelectTrigger className="w-16 h-10 rounded-l-none border-l-0 bg-gray-50">
											<SelectValue placeholder={maxUnit} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="L">L</SelectItem>
											<SelectItem value="Cr">Cr</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						<div className="flex justify-center">
							<div className="flex items-center space-x-2 px-4 py-2 rounded-md">
								<Checkbox
									id="referDocument"
									checked={referDocument}
									onCheckedChange={(checked) => {
										setReferDocument(checked as boolean);
									}}
									className="h-4 w-4 text-blue-600"
								/>
								<Label
									htmlFor="referDocument"
									className="text-sm cursor-pointer text-gray-700"
								>
									Refer the Document
								</Label>
							</div>
						</div>

						<div className="text-center font-medium text-gray-800 text-sm py-2 bg-black/5 rounded-md">
							{getDisplayRange()}
						</div>

						<Button
							className="w-full bg-black hover:bg-black/80 text-white h-10 text-sm font-medium rounded-md"
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

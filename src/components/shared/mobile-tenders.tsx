'use client';
import React, { useEffect, useState } from 'react';
import TenderDetailsDialog from './TenderDetailsDialog';
import { useQuery } from '@tanstack/react-query';
import Loading from '../ui/loading';
import { PopoverMobileFilter } from './moblie-filter';
import Select from 'react-select';
import { toast } from 'sonner';
import { MultiSelect } from '@mantine/core';
import axios from 'axios';
import { X } from 'lucide-react';
import { DatePickerWithRange } from './multi-select-demo';
import { formatIndianRupeePrice } from '../table/tender-columns';

const fetchTenders = async (queryParams: URLSearchParams): Promise<any> => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_ENDPOINT +
			`/api/tender/all?${queryParams.toString()}`,
	);
	if (!response.ok) {
		toast.error('Failed to fetch tenders');
	}
	return response.json();
};

export function formatCurrency(value: any): string {
	const crore = 1_00_00_000; // 1 crore = 10 million
	const lakh = 1_00_000; // 1 lakh = 100 thousand
	const thousand = 1_000; // 1 thousand = 1 thousand

	if (value >= crore) {
		return `${(value / crore).toFixed(2)}Cr`; // Format as Crore
	} else if (value >= lakh) {
		return `${(value / lakh).toFixed(2)}L`; // Format as Lakh
	} else if (value >= thousand) {
		return `${(value / thousand).toLocaleString('en-IN')}`; // Format with commas
	} else {
		return value.toString(); // Return as is for smaller numbers
	}
}

// Define the type for tender data
interface Tender {
	_id: string;
	tenderName: string;
	description: string;
	epublishedDate: string;
	bidSubmissionDate: string;
	bidOpeningDate: string;
	tenderValue: string;
	refNo: string;
	TenderId: string;
	district: string;
	state: string;
	department: string;
	subDepartment: string;
	location: string;
	address: string;
	pincode: string;
	active: boolean;
}

const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};
	return new Date(dateString).toLocaleDateString(undefined, options);
};

const MobileTenderList: React.FC = () => {
	const [sorting, setSorting] = React.useState<any>([]);
	const [columnFilters, setColumnFilters] = React.useState<any>([]);

	const [columnVisibility, setColumnVisibility] = React.useState<any>({});
	const [rowSelection, setRowSelection] = React.useState({});
	console.log(rowSelection, 'rowSelection');
	const isAnyRowSelected = Object.values(rowSelection).some(
		(selected) => selected,
	);

	const [selectedDistricts, setSelectedDistricts] = React.useState<any>([]);
	const [selectedDepartments, setSelectedDepartments] = React.useState<any>([]);
	const [selectedStatus, setSelectedStatus] = React.useState<any>([]);
	const [selectedRow, setSelectedRow] = React.useState<any>([]);

	const [status, setStatus] = React.useState<string>('');
	const [industry, setIndustry] = React.useState<any>('');
	const [subIndustry, setSubIndustry] = React.useState<any>('');
	const [classification, setClassification] = React.useState<any>('');
	const [selectedRowData, setSelectedRowData] = useState<Tender | null>(null);
	const [district, setDistrict] = useState<string>('');
	const [tenderValue, setTenderValue] = useState<string>('');
	const [department, setDepartment] = useState<string>('');
	const [selectedTenderValues, setSelectedTenderValues] = React.useState<any>(
		[],
	);

	const [filterIndustry, setFilterIndustry] = React.useState<any>([]);
	const [filterSubIndustry, setFilterSubIndustry] = React.useState<any>([]);

	const [endDate, setEndDate] = React.useState<any | null>(null);
	console.log(endDate, 'endDate');
	const [dateRange, setDateRange] = React.useState<any | null>(null);

	const [search, setSearch] = useState<string>('');
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['tenders'],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			// Helper to append multi-select values dynamically
			const appendMultiSelect = (key: string, values: any[]) => {
				if (values.length) {
					const isObjectWithValue =
						values[0] && typeof values[0] === 'object' && 'value' in values[0];

					const valueString = isObjectWithValue
						? values.map((item) => item.value).join(',')
						: values.join(',');

					queryParams.append(key, valueString);
				}
			};

			appendMultiSelect('district', selectedDistricts);
			appendMultiSelect('department', selectedDepartments);
			appendMultiSelect('tenderValue', selectedTenderValues);
			appendMultiSelect('status', selectedStatus);
			appendMultiSelect('industry', industry);
			appendMultiSelect('subIndustry', subIndustry);
			appendMultiSelect(
				'classification',
				classification ? [classification] : [],
			);

			// Append global search
			if (search) {
				queryParams.append('search', search);
			}

			// Append date range filter
			if (dateRange && dateRange.startDate && dateRange.endDate) {
				queryParams.append('startDate', dateRange.startDate.toISOString());
				queryParams.append('endDate', dateRange.endDate.toISOString());
			}

			return fetchTenders(queryParams);
		},
	});

	React.useEffect(() => {
		refetch();
	}, [
		district,
		tenderValue,
		status,
		search,
		selectedDistricts,
		selectedDepartments,
		selectedTenderValues,
		selectedStatus,
		industry,
		subIndustry,
		classification,
		dateRange,
	]);

	const fetchIndustry = async () => {
		const response = await axios.get(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/industries',
		);
		setFilterIndustry(response.data.industries);
		return response.data.industries;
	};

	const fetchSubIndustry = async () => {
		const response = await axios.get(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/sub-industries',
		);
		setFilterSubIndustry(response.data.subIndustries);
		return response.data.subIndustries;
	};

	React.useEffect(() => {
		fetchIndustry();
		fetchSubIndustry();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	const tenders = data?.result;

	const handleRowClick = (rowData: any) => {
		setSelectedRowData(rowData); // Set the clicked row data to state
	};

	const districts = [
		'Ariyalur',
		'Chengalpattu',
		'Chennai',
		'Coimbatore',
		'Cuddalore',
		'Dharmapuri',
		'Dindigul',
		'Erode',
		'Kallakurichi',
		'Kancheepuram',
		'Kanniyakumari',
		'Karur',
		'Krishnagiri',
		'Madurai',
		'Mayiladuthurai',
		'Nagapattinam',
		'Namakkal',
		'Nilgiris',
		'Perambalur',
		'Pudukkottai',
		'Ramanathapuram',
		'Ranipet',
		'Salem',
		'Sivaganga',
		'Tenkasi',
		'Thanjavur',
		'Theni',
		'Thoothukudi',
		'Tiruchirappalli',
		'Tirunelveli',
		'Tirupattur',
		'Tiruppur',
		'Tiruvallur',
		'Tiruvannamalai',
		'Tiruvarur',
		'Vellore',
		'Viluppuram',
		'Virudhunagar',
	];

	const departments = [
		'Agriculture Department',
		'Animal Husbandry Department',
		'BC, MBC & Minorities Welfare Department',
		'Commercial Taxes and Registration Department',
		'Co-operation, Food and Consumer Protection Department',
		'Energy Department',
		'Environment and Forests Department',
		'Finance Department',
		'Handlooms, Handicrafts, Textiles and Khadi Department',
		'Health and Family Welfare Department',
		'Higher Education Department',
		'Highways and Minor Ports Department',
		'Home, Prohibition and Excise Department',
		'Housing and Urban Development Department',
		'Industries Department',
		'Information Technology Department',
		'Labour Welfare and Skill Development Department',
		'Law Department',
		'Municipal Administration and Water Supply Department',
		'Planning, Development and Special Initiatives Department',
		'Public Department',
		'Public Works Department',
		'Revenue and Disaster Management Department',
		'Rural Development and Panchayat Raj Department',
		'School Education Department',
		'Social Welfare and Women Empowerment Department',
		'Tamil Development and Information Department',
		'Tourism, Culture and Religious Endowments Department',
		'Transport Department',
		'Youth Welfare and Sports Development Department',
	];

	const dropdownData: any = {
		District: districts.map((district) => ({
			value: district.toLowerCase().replace(/\s+/g, ''),
			label: district,
		})),
		'Tender Value': [
			{ value: '1', label: 'Less than ₹10L' },
			{ value: '2', label: '₹10L - ₹1Cr' },
			{ value: '3', label: '₹1Cr - ₹100Cr' },
			{ value: '4', label: 'More than ₹100Cr' },
		],
		Department: departments.map((department) => ({
			value: department
				.toLowerCase()
				.replace(/\s+/g, '')
				.replace(/[^a-z0-9]/g, ''),
			label: department,
		})),
		Industry: filterIndustry,
		SubIndustry: filterSubIndustry,
		Classification: [
			{ value: 'Good', label: 'Goods' },
			{ value: 'service', label: 'Service' },
			{ value: 'work', label: 'Works' },
		],
	};

	const handleMultiSelectChange = (label: string, value: any) => {
		console.log(value, 'selected');

		switch (label) {
			case 'District':
				setSelectedDistricts(value);
				break;
			case 'Department':
				setSelectedDepartments(value);
				break;
			case 'Industry':
				setIndustry(value);
				break;
			case 'SubIndustry':
				setSubIndustry(value);
				break;
			case 'Classification':
				setClassification(value);
				break;
			case 'Tender Value':
				setSelectedTenderValues(value);
				break;
			default:
				break;
		}
	};
	// Function to render the dropdown menu dynamically
	const renderMultiSelect = (label: string) => {
		// Map dropdown data to Mantine format and remove duplicates
		const options =
			dropdownData[label]?.map((option: any) => ({
				value: option.value, // Ensure that value is unique
				label: option.label, // Adjust according to your data structure
			})) || [];
		// Utility function to remove duplicate options
		const removeDuplicates = (options: { value: string; label: string }[]) => {
			const uniqueOptions = new Map();
			options.forEach((option) => {
				if (!uniqueOptions.has(option.value)) {
					uniqueOptions.set(option.value, option);
				}
			});
			return Array.from(uniqueOptions.values());
		};

		// Remove duplicate options based on 'value'
		const uniqueOptions = removeDuplicates(options);

		const getSelectedValues = (label: string) => {
			switch (label) {
				case 'District':
					return Array.isArray(selectedDistricts) ? selectedDistricts : [];
				case 'Department':
					return Array.isArray(selectedDepartments) ? selectedDepartments : [];
				case 'Tender Value':
					return Array.isArray(selectedTenderValues)
						? selectedTenderValues
						: [];
				case 'Industry':
					return Array.isArray(industry) ? industry : [];
				case 'SubIndustry':
					return Array.isArray(subIndustry) ? subIndustry : [];
				case 'Classification':
					return Array.isArray(classification) ? classification : [];
				default:
					return [];
			}
		};

		return (
			<div className="mb-4 w-full">
				<MultiSelect
					label={label}
					placeholder={`Pick ${label}`}
					data={uniqueOptions} // Use the filtered unique options
					value={getSelectedValues(label)} // Ensure value is an array
					onChange={(selected: any) => handleMultiSelectChange(label, selected)}
					className="basic-multi-select"
				/>
			</div>
		);
	};
	const clearFilters = () => {
		setDistrict('');
		setTenderValue('');
		setDepartment('');
		setStatus('');
		setSearch('');
		setSelectedDistricts([]);
		setSelectedTenderValues([]);
		setSelectedDepartments([]);
		setSelectedStatus([]);
		setIndustry('');
		setSubIndustry('');
		setClassification('');
	};
	const removeDistrict = (districtToRemove: string, setState: any) => {
		setState((prev: any) =>
			prev.filter((value: any) => value !== districtToRemove),
		);
	};
	const handleToAddRequest = async (selectedRowData: any): Promise<void> => {
		console.log(selectedRowData, 'selectedRowData');

		const url =
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/tender-mapping';

		try {
			// Create an array of promises for each tender ID
			const promises = selectedRow.map(async (tenderId: string) => {
				const data = { tenderId };

				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error(
						`Failed to create tender mapping for tenderId: ${tenderId}`,
					);
				}

				return response.json();
			});

			// Wait for all requests to complete
			const results = await Promise.all(promises);

			toast.success(
				'Tender documents request sent successfully. We will reach out to you soon.',
			);
			console.log('Tender mappings created successfully:', results);
		} catch (error) {
			toast.error('Error sending tender mapping requests.');
			console.error('Error sending tender mapping:', error);
		}
	};

	return (
		<div className="px-2 bg-[#F6F8F9] rounded-3xl py-4">
			<div className=" flex items-center justify-between w-full">
				<h2 className="text-[#6E7C87] py-2 text-xs font-semibold">
					Showing {tenders.length} Tenders in Tamilnadu
				</h2>
				<div className="">
					<PopoverMobileFilter renderMultiSelect={renderMultiSelect}>
						<div className="">
							<DatePickerWithRange
								setDateRange={setDateRange}
								dateRange={dateRange}
							/>
						</div>

						<div className="w-full">
							{isAnyRowSelected && (
								<button
									onClick={() => handleToAddRequest(selectedRowData)}
									className="bg-[#1C1A1A] text-nowrap px-4 w-full py-2.5 rounded-md text-white text-xs"
								>
									Request For Documents
								</button>
							)}
						</div>
					</PopoverMobileFilter>
				</div>
			</div>
			<div className="flex items-center py-2  px-2">
				{/* Conditional rendering of the Reset All button */}
				<div className="text-black flex flex-wrap gap-1 items-center">
					{(selectedDistricts.length > 0 ||
						selectedTenderValues.length > 0 ||
						industry.length > 0 ||
						classification) && (
						<button
							onClick={clearFilters}
							className="px-4 rounded-xl mr-3 border py-3 text-xs"
						>
							Reset All
						</button>
					)}
					{selectedDistricts?.map((district: string) => (
						<div
							key={district}
							className="mr-2 flex flex-col items-start px-3 pr-4 py-1 border text-xs rounded-xl relative"
						>
							{district}
							<span className="text-[8px] font-light">district</span>
							<button
								onClick={() => removeDistrict(district, setSelectedDistricts)}
								className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
								aria-label={`Remove ${district}`}
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					))}

					{selectedTenderValues?.map((value: string) => (
						<div
							key={value}
							className="mr-2 flex flex-col items-start px-3 pr-4 py-1 border text-xs rounded-xl relative"
						>
							{value}
							<span className="text-[8px] font-light">tender value</span>
							<button
								onClick={() => removeDistrict(value, setSelectedTenderValues)}
								className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
								aria-label={`Remove ${value}`}
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					))}

					{industry &&
						industry?.map((industry: string) => (
							<div
								key={industry}
								className="mr-2 flex flex-col items-start px-3 pr-4 py-1 border text-xs rounded-xl relative"
							>
								{industry}
								<span className="text-[8px] font-light">industry</span>
								<button
									onClick={() => removeDistrict(industry, setIndustry)}
									className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
									aria-label={`Remove ${industry}`}
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						))}

					{classification && (
						<div
							className="mr-2 flex flex-col items-start px-3 pr-4 py-1 border text-xs rounded-xl relative"
							key={classification}
						>
							{classification}
							<span className="text-[8px] font-light">classification</span>
							<button
								onClick={() => setClassification('')}
								className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
								aria-label={`Remove ${classification}`}
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					)}
				</div>
			</div>
			<TenderDetailsDialog
				selectedRowData={selectedRowData}
				setSelectedRowData={setSelectedRowData}
			/>
			{tenders?.map((tender: any) => (
				<div
					onClick={() => handleRowClick(tender)}
					key={tender._id}
					className="bg-white shadow-lg rounded-lg mb-4 p-4"
				>
					<div className="flex items-center text-[#4B0082] text-[10px] justify-between">
						<p>Opening Date: {formatDate(tender.bidOpeningDate)}</p>
						<p>Closing Date: {formatDate(tender.bidSubmissionDate)}</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="text-[20px]  text-[#500187] font-bold">
							{formatIndianRupeePrice(tender.tenderValue)}
						</div>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-[#667085] w-[60%] text-[12px]">
							{tender.tenderName}
						</p>
						<p className="text-[#667085] text-[10px]">{tender.TenderId}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default MobileTenderList;

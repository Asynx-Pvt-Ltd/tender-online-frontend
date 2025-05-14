import React, { useCallback } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useTenderFilters } from '@/components/hook/use-tender-filters';
import TenderFilters, { FilterLabels } from './tender-filters';
import SearchTab from './search-tab';
import Loading from '../ui/loading';
import TenderDetailsDialog from '../shared/TenderDetailsDialog';
import TenderColumns, { formatDate } from './tender-columns';
import { toast } from 'sonner';
import { formatIndianRupeePrice, getTenderValueCategory } from '@/utils/utils';
import SaveTenderButton from '../shared/saveButton';
import { TenderValueEnum } from '@/enums';
import ExactTenderIdSearch from './tenderID-search';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';

interface ViewedTenderData {
	tenderIds: string[];
	timestamp: number;
}

export function DataTableTender({ setSearch, search, setTenderLength }: any) {
	const columns = TenderColumns();
	const [foryou, setForYou] = React.useState<any | null>(null);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [selectedRowData, setSelectedRowData] = React.useState(null);
	const [selectedRow, setSelectedRow] = React.useState<any>([]);

	const [viewedTenders, setViewedTenders] = React.useState<string[]>([]);
	const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	// const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
	// const EXPIRATION_TIME = 5 * 1000;
	const [showClosedTenders, setShowClosedTenders] = React.useState(false);
	const [exactTenderId, setExactTenderId] = React.useState('');
	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const foryouValue = params.get('foryou');
			if (foryouValue == 'true') setForYou(true);
			else setForYou(false);
		}
	}, []);

	React.useEffect(() => {
		const loadViewedTenders = () => {
			const stored = localStorage.getItem('viewedTenders');
			if (stored) {
				const data: ViewedTenderData = JSON.parse(stored);
				const now = new Date().getTime();

				// Check if data has expired
				if (now - data.timestamp < EXPIRATION_TIME) {
					setViewedTenders(data.tenderIds);
				} else {
					// Clear expired data
					localStorage.removeItem('viewedTenders');
					setViewedTenders([]);
				}
			}
		};
		loadViewedTenders();
	}, []);

	const {
		districts,
		departments,
		selectedDistricts,
		setSelectedDistricts,
		industry,
		setIndustry,
		classification,
		setFilterClassification,
		filterClassification,
		setClassification,
		dateRange,
		setDateRange,
		buildQueryParams,
		filterIndustry,
		filterSubIndustry,
		searchList,
		setSearchList,
		suggestionIndustry,
		suggestionClassification,
		states,
		setStates,
		filterStates,
	} = useTenderFilters();
	const [selectedTenderValues, setSelectedTenderValues] = React.useState<
		[] | TenderValueEnum.REFERTHEDOCUMENT
	>([]);
	const [page, setPage] = React.useState(0);
	const [inputPage, setInputPage] = React.useState(1);

	const [pageSize, setPageSize] = React.useState<number>(10);

	const handlePageSizeChange = (value: string) => {
		const newSize = parseInt(value);
		setPageSize(newSize);
		setPage(0); // Reset to first page when changing page size
		setInputPage(1);
	};

	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow numeric input
		setInputPage(value === '' ? 1 : Math.max(1, parseInt(value)));
	};

	const handleGoToPage = () => {
		// Adjust for zero-based indexing and ensure within bounds
		const targetPage = Math.min(
			Math.max(0, inputPage - 1),
			Math.ceil((tenders?.count || 0) / 10) - 1,
		);
		setPage(targetPage);
	};

	// Update inputPage when page changes
	React.useEffect(() => {
		setInputPage(page + 1);
	}, [page]);

	const {
		data: tenders,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: [
			'tenders',
			buildQueryParams().toString(),
			page,
			pageSize,
			Array.isArray(selectedTenderValues)
				? selectedTenderValues.join(',')
				: selectedTenderValues,
			sorting.length > 0
				? `${sorting[0].id}-${sorting[0].desc ? 'desc' : 'asc'}`
				: 'default',
			showClosedTenders,
		],
		queryFn: async () => {
			const params = buildQueryParams();

			if (exactTenderId) {
				params.append('exactTenderId', exactTenderId);
			}

			if (sorting.length > 0) {
				const sortColumn = sorting[0].id;
				const sortDirection = sorting[0].desc ? 'desc' : 'asc';
				params.append('sortBy', sortColumn);
				params.append('sortOrder', sortDirection);
			}

			if (selectedTenderValues && selectedTenderValues.length > 0) {
				if (Array.isArray(selectedTenderValues)) {
					selectedTenderValues.forEach((value: number) => {
						if (value === null) {
							params.append('tenderValueNull', 'true');
						} else {
							params.append('tenderValue', value.toString());
						}
					});
				} else {
					params.append('tenderValue', selectedTenderValues);
				}
			}
			if (showClosedTenders) {
				params.append('showClosed', 'true');
			}
			params.append('limit', pageSize.toString());
			params.append('offset', (page * pageSize).toString());

			const response = await fetch(
				process.env.NEXT_PUBLIC_API_ENDPOINT +
					`/api/tender/all?${params.toString()}`,
			);
			if (!response.ok) {
				toast.error('Failed to fetch tenders');
			}
			return response.json();
		},
	});
	const totalPages = React.useMemo(
		() => Math.max(1, Math.ceil((tenders?.count || 0) / pageSize)),
		[tenders?.count, pageSize],
	);

	React.useEffect(() => {
		if (sorting.length > 0) {
			setPage(0);
			setInputPage(1);
		}
	}, [sorting]);

	React.useEffect(() => {
		refetch();
		setPage(0);
		setInputPage(1);
	}, [
		selectedTenderValues,
		showClosedTenders,
		exactTenderId,
		refetch,
		pageSize,
		selectedDistricts,
		industry,
		classification,
		dateRange,
		searchList,
		states,
		sorting,
	]);
	const clearFilters = useCallback(() => {
		setSelectedDistricts([]);
		setSelectedTenderValues([]);
		setIndustry([]);
		setClassification([]);
		setDateRange(null);
		setSearchList([]);
		setShowClosedTenders(false);
		setStates([]);
		refetch();
	}, [refetch]);

	const handleRowClick = useCallback((rowData: any) => {
		setSelectedRowData(rowData);

		// Add the tender ID to viewedTenders
		setViewedTenders((prev) => {
			if (!prev.includes(rowData._id)) {
				const newTenders = [...prev, rowData._id];
				const dataToStore: ViewedTenderData = {
					tenderIds: newTenders,
					timestamp: new Date().getTime(),
				};
				localStorage.setItem('viewedTenders', JSON.stringify(dataToStore));
				return newTenders;
			}
			return prev;
		});
	}, []);
	const table = useReactTable({
		data: tenders?.result || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),

		// getSortedRowModel: getSortedRowModel(), //old default sorting
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualSorting: true,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	React.useEffect(() => {
		if (tenders?.count !== undefined) {
			setTenderLength(tenders.count);
		}
	}, [tenders?.count]);

	React.useEffect(() => {
		if (rowSelection) {
			const selectedRows = table?.getSelectedRowModel()?.rows;
			const ids = selectedRows.map((row: any) => row.original._id);
			setSelectedRow(ids);
		}
	}, [rowSelection, table]);

	React.useEffect(() => {
		if (foryou) {
			setIndustry(suggestionIndustry);
			setClassification(suggestionClassification);
		} else {
			clearFilters();
		}
	}, [foryou, suggestionIndustry, suggestionClassification]);

	const fetchSingle = async (tenderId: string) => {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/getSingle',
			{
				method: 'POST',
				body: JSON.stringify({ tenderId }),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		const { data } = await res.json();
		return data;
	};

	const handleToAddRequest = async () => {
		try {
			const validResults = await Promise.all(
				selectedRow.map(async (tenderId: string, index: number) => {
					try {
						const data = await fetchSingle(tenderId);

						const currentTime = new Date().getTime();
						const closingTime = new Date(data.bidSubmissionDate).getTime();

						if (currentTime > closingTime) {
							toast.info(`Submission Time Expired for tender ID: ${tenderId}`);
							return null;
						}

						const response = await fetch(
							process.env.NEXT_PUBLIC_API_ENDPOINT +
								'/api/tender/tenderRequest',
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${sessionStorage.getItem(
										'accessToken',
									)}`,
								},
								body: JSON.stringify({ data }),
							},
						);

						if (!response.ok) {
							throw new Error(
								`Failed to create tender mapping for tenderId: ${tenderId}`,
							);
						}

						console.log(
							`Successfully processed tender ${index + 1} (ID: ${tenderId})`,
						);
						return response.json();
					} catch (error) {
						console.error(
							`Error processing tender ${index + 1} (ID: ${tenderId}):`,
							error,
						);
						return null;
					}
				}),
			);

			const successfulResults = validResults.filter(
				(result) => result !== null,
			);

			if (successfulResults.length > 0) {
				toast.success(
					`Successfully processed ${successfulResults.length} tender requests. We will reach out to you soon.`,
				);
			} else {
				toast.warning('No valid tenders were processed.');
			}
		} catch (error) {
			toast.error('Error sending tender mapping requests.');
		}
	};

	if (isLoading) return <Loading />;

	const isAnyRowSelected = Object.values(rowSelection).some(
		(selected) => selected,
	);

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
		Classification: filterClassification,
		States: filterStates,
	};

	return (
		<div className="w-full border rounded-xl">
			<div className="flex flex-col-reverse gap-6 lg:gap-6 lg:flex-row lg:items-start lg:justify-between px-2 py-2">
				<div className="flex flex-col w-full gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						<div className="w-full">
							<SearchTab
								refetch={() => {}}
								setSearchList={setSearchList}
								searchList={searchList}
								search={search}
								setSearch={setSearch}
							/>
						</div>
						<div className="w-full">
							<ExactTenderIdSearch
								exactTenderId={exactTenderId}
								setExactTenderId={setExactTenderId}
								refetch={refetch}
							/>
						</div>
					</div>

					<div className="w-full mt-2">
						<FilterLabels
							selectedDistricts={selectedDistricts}
							selectedTenderValues={selectedTenderValues}
							industry={industry}
							classification={classification}
							dateRange={dateRange}
							setSelectedDistricts={setSelectedDistricts}
							setSelectedTenderValues={setSelectedTenderValues}
							setIndustry={setIndustry}
							setClassification={setClassification}
							setDateRange={setDateRange}
							clearFilters={clearFilters}
							dropdownData={dropdownData}
							foryou={foryou}
							showClosedTenders={showClosedTenders}
							setShowClosedTenders={setShowClosedTenders}
							states={states}
							setStates={setStates}
							exactTenderId={exactTenderId}
							setExactTenderId={setExactTenderId}
						/>
					</div>
				</div>
				<div className="flex items-start gap-2">
					<TenderFilters
						selectedDistricts={selectedDistricts}
						selectedTenderValues={selectedTenderValues}
						industry={industry}
						classification={classification}
						dateRange={dateRange}
						setSelectedDistricts={setSelectedDistricts}
						setSelectedTenderValues={setSelectedTenderValues}
						setIndustry={setIndustry}
						setClassification={setClassification}
						setDateRange={setDateRange}
						clearFilters={clearFilters}
						dropdownData={dropdownData}
						foryou={foryou}
						showClosedTenders={showClosedTenders}
						setShowClosedTenders={setShowClosedTenders}
						states={states}
						setStates={setStates}
					/>
					{isAnyRowSelected && (
						<button
							onClick={handleToAddRequest}
							className="bg-[#1C1A1A] text-nowrap px-4 w-full py-2.5 rounded-md text-white text-xs"
						>
							Request For Documents
						</button>
					)}
				</div>
			</div>

			<div className="w-full hidden sm:block md:block lg:block">
				{/* <ScrollArea> */}
				<Table className="min-w-full lg:overflow-hidden md:overflow-scroll">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={`hover:scale-[1.01] transition-all ${
										viewedTenders.includes(row.original._id)
											? 'bg-purple-50 hover:bg-purple-100'
											: ''
									}`}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="cursor-pointer font-roboto"
											onClick={() => {
												if (cell.column.columnDef.id !== 'select') {
													handleRowClick(row.original);
												}
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				{/* </ScrollArea> */}
				<TenderDetailsDialog
					selectedRowData={selectedRowData}
					setSelectedRowData={setSelectedRowData}
				/>
			</div>
			<div className="w-full sm:hidden flex flex-col gap-2 h-[400px] overflow-y-auto overflow-x-auto sm:overflow-x-visible">
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => {
						const tender = row.original;
						return (
							<div
								onClick={() => handleRowClick(tender)}
								key={tender._id}
								className={`shadow-md rounded-lg mb-4 p-4 hover:scale-[1.01] transition-all cursor-pointer flex flex-col gap-2 h-auto ${
									viewedTenders.includes(tender._id)
										? 'bg-purple-50 hover:bg-purple-100'
										: ''
								}`}
							>
								<div className="flex justify-between items-center">
									<p className="text-[#667085] text-[10px] font-semibold">
										Reference No:{' '}
										<span className="font-normal">{tender.refNo}</span>
									</p>
									<SaveTenderButton tenderId={row.original._id} />
								</div>

								<div className="flex items-center justify-between">
									<p className="text-[12px] font-bold">{tender.tenderName}</p>
								</div>

								<div className="flex items-center gap-2 font-bold text-[#667085] text-[12px]">
									Tender Value:
									<div className="text-[14px] text-black font-bold">
										{formatIndianRupeePrice(
											tender.tenderValue
												? tender.tenderValue
												: 'Refer the Document',
										)}
									</div>
								</div>

								<div className="flex items-center text-black text-[10px] justify-between font-semibold pt-1">
									<p className="flex gap-1">
										Opening Date:
										<span className="font-normal">
											{formatDate(tender.bidOpeningDate)}
										</span>
									</p>
									<p className="flex gap-1">
										Closing Date:
										<span className="font-normal">
											{formatDate(tender.bidSubmissionDate)}
										</span>
									</p>
								</div>
							</div>
						);
					})
				) : (
					<div className="text-center py-6 bg-white rounded-lg shadow">
						No results.
					</div>
				)}
			</div>
			<div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center justify-between px-4 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{tenders?.count || 0} total
				</div>
				<div className="flex lg:flex-row lg:gap-0 gap-6 flex-col items-center lg:space-x-8">
					{/* Items per page dropdown */}
					<div className="flex items-center space-x-2 my-5 lg:mb-0">
						<span className="text-sm whitespace-nowrap">Items per page</span>
						<Select
							value={pageSize.toString()}
							onValueChange={handlePageSizeChange}
						>
							<SelectTrigger className="w-16 h-8">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Page input and navigation */}
					<div className="flex lg:flex-row flex-col items-center lg:space-x-8 gap-4">
						<div className="flex gap-2 items-center">
							<div className="flex items-center space-x-2">
								<span className="text-sm">Page</span>
								<input
									type="number"
									value={inputPage}
									onChange={handlePageInputChange}
									min="1"
									max={totalPages}
									className="w-16 px-2 py-1 border rounded text-sm"
								/>
								<Button variant="default" size="sm" onClick={handleGoToPage}>
									Go
								</Button>
							</div>
							<div className="text-sm">of {totalPages}</div>
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setPage(0);
									setInputPage(1);
								}}
								disabled={page === 0}
								className="text-black/35 hover:text-black/100"
							>
								First
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const lastPage = totalPages - 1;
									setPage(lastPage);
									setInputPage(totalPages);
								}}
								disabled={page >= totalPages - 1}
								className="text-black/35 hover:text-black/100"
							>
								Last
							</Button>
							<Button
								variant="default"
								size="sm"
								onClick={() => {
									setPage((p) => p - 1);
									setInputPage(page);
								}}
								disabled={page === 0}
							>
								Previous
							</Button>
							<Button
								variant="default"
								size="sm"
								onClick={() => {
									setPage((p) => p + 1);
									setInputPage(page + 2);
								}}
								disabled={page >= totalPages - 1}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

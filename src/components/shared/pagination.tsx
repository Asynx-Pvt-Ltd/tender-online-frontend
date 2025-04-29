'use client';
import { useState, useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function Pagination({
	table,
	tenders,
}: {
	table: any;
	tenders: any;
}) {
	const [page, setPage] = useState(0);
	const [inputPage, setInputPage] = useState('1');
	const [pageSize, setPageSize] = useState(10);

	// Reset page when page size changes
	useEffect(() => {
		setPage(0);
		setInputPage('1');
	}, [pageSize]);

	const totalPages = Math.ceil((tenders?.count || 0) / pageSize);

	const handlePageInputChange = (e: any) => {
		setInputPage(e.target.value);
	};

	const handleGoToPage = () => {
		const pageNumber = Number(inputPage);
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setPage(pageNumber - 1);
		} else {
			// Reset to valid value if out of range
			setInputPage((page + 1).toString());
		}
	};

	const handlePageSizeChange = (value: any) => {
		setPageSize(Number(value));
	};

	return (
		<div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center justify-between px-4 py-4">
			<div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{' '}
				{tenders?.count || 0} total
			</div>
			<div className="flex lg:flex-row lg:gap-0 gap-6 flex-col items-center lg:space-x-8">
				{/* Items per page dropdown */}
				<div className="flex items-center space-x-2">
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
								setInputPage('1');
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
								setInputPage(totalPages.toString());
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
								setInputPage(page.toString());
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
								setInputPage((page + 2).toString());
							}}
							disabled={page >= totalPages - 1}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

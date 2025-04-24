import { X } from 'lucide-react';
import React from 'react';
import { Input } from '../ui/input';

const ExactTenderIdSearch = ({
	exactTenderId,
	setExactTenderId,
	refetch,
}: any) => {
	const [inputValue, setInputValue] = React.useState('');

	const handleSearch = () => {
		setExactTenderId(inputValue);
		refetch();
	};

	const handleClear = () => {
		setInputValue('');
		setExactTenderId('');
		refetch();
	};

	return (
		<div className="flex items-center">
			<div className="relative flex items-center w-full">
				<Input
					type="text"
					placeholder="Search by Tender ID"
					className="custom-search-border px-3 py-2 w-full"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				{inputValue && (
					<button onClick={handleClear} className="absolute right-2 text-white">
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
			<button
				onClick={handleSearch}
				className="bg-black text-white px-4 py-2 rounded-r-md rounded-l-sm"
			>
				Find
			</button>
		</div>
	);
};

export default ExactTenderIdSearch;

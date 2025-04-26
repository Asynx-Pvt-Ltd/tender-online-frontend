'use client';
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
	React.useEffect(() => {
		setInputValue(exactTenderId);
	}, [exactTenderId]);

	return (
		<div className="flex items-center">
			<div className="relative flex items-center w-full px-2">
				<Input
					type="text"
					placeholder="Search for Tender ID"
					className="custom-search-border px-3 py-2 lg:w-[15vw] w-full"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				{inputValue && (
					<button
						onClick={handleClear}
						className="absolute lg:right-32 text-white right-4"
					>
						<X className="h-4 w-4 text-black" />
					</button>
				)}
			</div>
		</div>
	);
};

export default ExactTenderIdSearch;

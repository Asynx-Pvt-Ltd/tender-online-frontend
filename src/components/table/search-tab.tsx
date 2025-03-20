import React, { useState, KeyboardEvent, ChangeEvent, FC } from 'react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import axios from 'axios';

interface SearchTabProps {
	search: string;
	setSearch: (value: string) => void;
	refetch: () => void;
	searchList: string[];
	setSearchList: any;
}

const SearchTab: FC<SearchTabProps> = ({
	search,
	setSearch,
	refetch,
	searchList,
	setSearchList,
}) => {
	const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && search.trim()) {
			// Prevent adding duplicate tags
			if (!searchList.includes(search)) {
				setSearchList((prev: any) => [...prev, search]);
				setSearch('');

				toast.success('Search tag added successfully');

				const response = await axios.post(
					process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/keyword/suggestion',
					{
						keyword: search,
					},
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
						},
					},
				);

				const data = response.data;
				console.log(data);
			} else {
				toast.info(
					'Duplicate tags are not allowed please enter a different tag',
				);
			}

			event.preventDefault();
		}
	};

	const handleRemoveTag = (index: number): void => {
		// Remove the tag from the searchList by index
		setSearchList((prev: string[]) => prev.filter((_, i) => i !== index));
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSearch(event.target.value);
	};

	return (
		<div className="w-full px-2 py-0">
			<Input
				placeholder="Search tenders..."
				value={search}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				className="max-w-xl custom-search-border !outline-none border-transparent focus:border-transparent focus:ring-0"
			/>
			{searchList.length > 0 && (
				<div className="flex flex-wrap mt-4 gap-2">
					{searchList.map((tag, index) => (
						<div
							onClick={() => handleRemoveTag(index)}
							key={index}
							className="bg-gray-100 text-xs text-gray-800 px-2 py-1 rounded-full flex items-center space-x-1 cursor-pointer"
						>
							<span>{tag}</span>
							<button
								onClick={() => handleRemoveTag(index)}
								className="ml-2 text-blue-500 hover:text-blue-700"
								aria-label={`Remove ${tag}`}
							>
								&times;
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchTab;

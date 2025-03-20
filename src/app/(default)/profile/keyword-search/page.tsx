'use client';
import { useQuery } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const KeywordSuggestion: React.FC = () => {
	const [keywords, setKeywords] = useState<string[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ['tenders'],
		queryFn: async () => {
			const response = await fetch(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/keyword',
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
				},
			);
			return response.json();
		},
	});

	useEffect(() => {
		if (!isLoading && data) {
			setKeywords(data.keyword);
		}
	}, [data, isLoading]);

	return (
		<div className="p-6 w-full min-h-screen flex items-center justify-center">
			<div className="w-full max-w-lg bg-white rounded-lg p-6 space-y-4">
				<h2 className="text-2xl font-bold text-gray-800 text-center pb-2">
					Keyword Suggestions
				</h2>

				{/* no data fount message */}
				{isLoading && <div>Loading...</div>}

				{/* Keyword Input */}

				{/* Keyword List */}
				<div className="flex flex-wrap gap-3">
					{keywords?.map((keyword, index) => (
						<div
							key={index}
							className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full shadow-sm space-x-2"
						>
							<span>{keyword}</span>
							<XIcon
								onClick={() =>
									setKeywords((prev) => prev.filter((_, i) => i !== index))
								}
								className="w-4 h-4 cursor-pointer hover:text-indigo-500"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default KeywordSuggestion;

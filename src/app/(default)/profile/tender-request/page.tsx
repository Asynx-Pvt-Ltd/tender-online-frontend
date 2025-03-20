'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

// Type definition for tender and user data structure
type TenderData = {
	_id: string;

	tenderTitle: string;
	tenderId: string;
	epublishedDate: string;
	bidSubmissionDate: string;
	tenderValue: string;
	refNo: string;
	district: string;
	state: string;
	department: string;
	industry: string;
	address: string;

	userId: {
		name: string;
		email: string;
		companyName: string;
		profile_image?: string;
	};
};

const Page: React.FC = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['user-tender'],
		queryFn: async () => {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/me/tenderRequest',
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
				},
			);
			return response.data.mappings;
		},
	});

	// return data?.map((tender: TenderData) => console.log(tender));
	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading tenders.</div>;

	return (
		<div className="p-6 bg-white lg:bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-semibold text-center mb-8">Tender List</h1>
			{data?.length === 0 && (
				<div className="text-center text-gray-500">
					No tenders found. Please check back later.
				</div>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.map((tender: TenderData) =>
					tender.tenderId ? (
						<div
							key={tender._id}
							className="bg-white cursor-pointer rounded-3xl p-6 shadow-md"
						>
							<div className="flex items-center space-x-4 mb-4">
								{tender.userId.profile_image ? (
									<img
										src={tender.userId.profile_image}
										alt={`${tender.userId.name}'s profile`}
										className="w-12 h-12 rounded-full"
									/>
								) : (
									<div className="w-12 h-12 rounded-full bg-gray-300" />
								)}
								<div>
									<h2 className="text-lg font-semibold text-gray-700">
										{tender.userId.name}
									</h2>
									<p className="text-sm text-gray-500">
										{tender.userId.companyName}
									</p>
								</div>
							</div>
							<h3 className="text-xl font-bold text-blue-600">
								{tender?.tenderTitle}
							</h3>
							<p className="text-gray-600 text-sm mb-2">{tender?.department}</p>
							<p className="text-gray-500 text-sm mb-4">
								Location: {tender?.district}, {tender?.state}
							</p>
							<div className="text-gray-700 mb-2">
								<p>
									<span className="font-semibold">Bid Submission:</span>{' '}
									{new Date(tender?.bidSubmissionDate).toLocaleDateString()}
								</p>
								<p>
									<span className="font-semibold">Tender Value:</span> ₹
									{tender?.tenderValue}
								</p>
							</div>
							<div className="text-gray-500 text-sm">
								<p>
									<span className="font-semibold">Reference No:</span>{' '}
									{tender?.refNo}
								</p>
								<p>
									<span className="font-semibold">Industry:</span>{' '}
									{tender?.industry}
								</p>
								<p>
									<span className="font-semibold">Address:</span>{' '}
									{tender?.address}
								</p>
							</div>
						</div>
					) : (
						''
					),
				)}
			</div>
		</div>
	);
};

export default Page;

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, MultiSelect } from '@mantine/core';
import { industriesData } from '../hook/use-tender-filters';
import { SelectState } from './selectState';

export function CheckSuggestion() {
	const [classification, setClassification] = useState([]);
	const [industry, setIndustry] = useState([]);
	const [filterClassification, setFilterClassification] = useState<any>([]);
	const [state, setState] = useState<string[]>([]);
	const [filterState, setFilterState] = useState<any>([]);
	const [filterIndustry, setFilterIndustry] = useState(
		industriesData.map((ind) => ({ value: ind.value, label: ind.label })),
	);

	useEffect(() => {
		const fetchClass = async () => {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/classifications',
			);
			setFilterClassification(response.data.classifications);
			return response.data.classifications;
		};
		const fetchStates = async () => {
			try {
				const response = await axios.get(
					process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/states',
				);
				setFilterState(response.data.states);
				return response.data.states;
			} catch (error) {
				console.error('Error fetching states:', error);
				return [];
			}
		};
		fetchClass();
		fetchStates();
	}, []);
	// Fetch suggestions to check if the user has already added them
	const fetchSuggestions = async () => {
		const { data } = await axios.get(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/suggestion/check',
			{
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
				},
			},
		);
		return data;
	};

	// useQuery to fetch suggestions
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['suggestion'],
		queryFn: fetchSuggestions,
	});

	const dropdownData: any = {
		Industry: filterIndustry,
		State:
			filterState.length > 0
				? filterState
				: [{ value: 'tamil-nadu', label: 'Tamil Nadu' }],
		Classification: filterClassification,
	};

	const handleMultiSelectChange = (label: string, value: any) => {
		console.log(value, 'selected');

		switch (label) {
			case 'Industry':
				setIndustry(value);
				break;
			case 'Classification':
				setClassification(value);
				break;
			case 'State':
				setState(value);
			default:
				break;
		}
	};

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

	const renderMultiSelect = (label: string) => {
		// Map dropdown data to Mantine format and remove duplicates
		const options =
			dropdownData[label]?.map((option: any) => ({
				value: option.value, // Ensure that value is unique
				label: option.label, // Adjust according to your data structure
			})) || [];

		// Remove duplicate options based on 'value'
		const uniqueOptions = removeDuplicates(options);

		const getSelectedValues = (label: string) => {
			switch (label) {
				case 'Industry':
					return Array.isArray(industry) ? industry : [];

				case 'Classification':
					return Array.isArray(classification) ? classification : [];

				case 'State':
					return Array.isArray(state) ? state : [];

				default:
					return [];
			}
		};

		return (
			<div className="w-full">
				<div className="grid gap-4">
					{label === 'State' ? (
						<SelectState
							setState={(value) => handleMultiSelectChange('State', value)}
						/>
					) : (
						<MultiSelect
							required
							label={label}
							placeholder={`Pick ${label}`}
							data={uniqueOptions}
							value={getSelectedValues(label)}
							onChange={(selected) => handleMultiSelectChange(label, selected)}
							className="basic-multi-select"
						/>
					)}
				</div>
			</div>
		);
	};

	const dropdownLabels = ['Industry', 'Classification', 'State'];
	// Utility function to check if suggestions exist with minimum length
	const checkIfSuggestionsExist = (
		suggestion: { classification?: string; industry?: string; state?: string },
		minLength: number = 1,
	): any => {
		return (
			(suggestion.classification &&
				suggestion.classification.length >= minLength) ||
			(suggestion.industry && suggestion.industry.length >= minLength)
		);
	};

	// Mutation to add new suggestion
	const addSuggestionMutation = useMutation({
		mutationFn: async () => {
			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/suggestion',
				{
					classification,
					industry,
					state,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
				},
			);
			return response.data;
		},
		onSuccess: () => {
			refetch();
			// Optionally, you can invalidate the query to refetch suggestions
			// queryClient.invalidateQueries(["suggestion"]);
			resetForm();
		},
		onError: (error: any) => {
			console.error('Error adding suggestion:', error);
		},
	});

	// Reset form fields
	const resetForm = () => {
		setClassification([]);
		setIndustry([]);
		setState([]);
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addSuggestionMutation.mutate();
	};

	if (isLoading) {
		return 'Loading';
	}

	return (
		<div className="">
			<Modal
				size={'lg'}
				centered
				opened={!checkIfSuggestionsExist(data.suggestion)}
				onClose={close}
				title="Select you are search for"
			>
				{/* Modal content */}
				{data && !checkIfSuggestionsExist(data.suggestion) && (
					<form onSubmit={handleSubmit} className="grid gap-4 py-4">
						{dropdownLabels.map((label) => renderMultiSelect(label))}
						<DialogFooter>
							<Button type="submit">Add Suggestion</Button>
						</DialogFooter>
					</form>
				)}
			</Modal>
		</div>
	);
}

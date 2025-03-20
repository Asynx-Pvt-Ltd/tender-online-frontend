import { toast } from 'sonner';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

const SaveTenderButton = ({ tenderId }: { tenderId: string }) => {
	const [isSaved, setIsSaved] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		const checkSavedStatus = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check-saved-tender`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
						},
						body: JSON.stringify({ tenderId }),
					},
				);

				if (response.ok) {
					const data = await response.json();
					setIsSaved(data.isSaved);
				}
			} catch (error) {
				console.error('Error checking saved status:', error);
			}
		};

		checkSavedStatus();
	}, [tenderId]);

	const toggleSavedStatus = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent row click event

		if (isLoading) return;

		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/save-tender`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
					body: JSON.stringify({ tenderId }),
				},
			);

			if (response.ok) {
				const result = await response.json();
				setIsSaved(!isSaved);
				toast.success(result.message);
			} else {
				const error = await response.json();
				toast.error(error.message || 'Failed to save tender');
			}
		} catch (error) {
			console.error('Error saving tender:', error);
			toast.error('Network error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			onClick={toggleSavedStatus}
			disabled={isLoading}
			title={isSaved ? 'Remove from saved' : 'Save tender'}
		>
			{isSaved ? (
				<BookmarkCheck className="h-5 w-5 text-black" />
			) : (
				<Bookmark className="h-5 w-5 text-gray-500 hover:text-black" />
			)}
		</Button>
	);
};

export default SaveTenderButton;

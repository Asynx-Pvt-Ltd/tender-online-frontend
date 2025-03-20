'use client';
import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CreditCardIcon } from 'lucide-react';

const formatDate = (date) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

const getUserStatusVariant = (status) => {
	switch (status) {
		case 'active':
			return 'default';
		case 'cancelled':
			return 'destructive';
		case 'completed':
			return 'default';
		default:
			return 'secondary';
	}
};
const getUserStatusColour = (status) => {
	switch (status) {
		case 'active':
			return 'bg-[#0fc000] text-white';
		case 'cancelled':
			return 'bg-[#b5b5b5]';
		case 'free trial':
			return 'bg-[#2838ff] text-white';
		case 'free trial expired':
			return 'bg-[#fd0947] text-white';
		default:
			return 'bg-[#b5b5b5] text-white';
	}
};
const PlanPage = () => {
	const [userData, setUserData] = useState(null);
	const [otherTransactions, setOtherTransactions] = useState(null);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const userDataReq = await fetch(
					process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/me',
					{
						headers: {
							Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
						},
					},
				);
				const userData = await userDataReq.json();
				setUserData(userData);
			} catch (error) {}
		};

		fetchUserDetails();
	}, []);

	useEffect(() => {
		const fetchOtherTransactions = async () => {
			try {
				const otherTransactionsReq = await fetch(
					process.env.NEXT_PUBLIC_API_ENDPOINT +
						'/api/auth/payment/transcation',

					{
						method: 'POST',
						body: JSON.stringify({ clientId: userData.clientId }),
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);
				const data = await otherTransactionsReq.json();
				setOtherTransactions(data);
			} catch {}
		};
		fetchOtherTransactions();
	}, [userData]);

	if (!userData) return null;

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<h1 className="text-3xl font-bold text-center mb-6 text-foreground">
				Subscription Details
			</h1>
			<Card
				className={getUserStatusColour(userData.paymentStatus.toLowerCase())}
			>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCardIcon className="w-6 h-6" />
						Current Subscription
					</CardTitle>
					<CardDescription>Details of your active plan</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Status</span>
								<Badge
									variant={getUserStatusVariant(
										userData.paymentStatus.toLowerCase(),
									)}
								>
									{userData.paymentStatus}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Plan Amount</span>
								<span className="font-semibold">
									₹{userData.subscriptionAmount}
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Valid Until</span>
								<div className="flex items-center gap-2">
									<CalendarIcon className="w-4 h-4 text-muted-foreground" />
									<span>{formatDate(userData.subscriptionValidity)}</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Period</span>
								<span>
									{userData.subscriptionHistory.length > 0 &&
										userData.subscriptionHistory[
											userData.subscriptionHistory.length - 1
										].duration}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Subscription History</CardTitle>
					<CardDescription>Previous subscription details</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Plan</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
								<TableHead className="text-right">Duration</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{userData.subscriptionHistory.length > 0 &&
								userData.subscriptionHistory.slice(0, -1).map((item, index) => (
									<TableRow key={item.subscriptionId}>
										<TableCell className="font-medium">
											₹{item.amount}
										</TableCell>
										<TableCell>{formatDate(item.subscriptionDate)}</TableCell>
										<TableCell>{formatDate(item.validUntil)}</TableCell>
										<TableCell className="text-right">
											{item.duration}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Other Transactions</CardTitle>
					<CardDescription>Other Transaction Details</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Transaction ID</TableHead>
								<TableHead>Transaction Amount</TableHead>
								<TableHead>Transaction Date</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{otherTransactions?.reverse().map((transaction, index) => (
								<TableRow key={transaction.userId.clientId}>
									<TableCell>{transaction._id}</TableCell>
									<TableCell>₹{transaction.amount_received}</TableCell>
									<TableCell>{formatDate(transaction.payment_date)}</TableCell>
									<TableCell>
										<Badge
											variant={getUserStatusVariant(
												transaction.transaction_status.toLowerCase(),
											)}
										>
											{transaction.transaction_status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

export default PlanPage;

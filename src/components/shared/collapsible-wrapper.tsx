'use client';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
interface CollapsibleWrapperProps {
	children?: React.ReactNode;
	title: string;
	subTitle: string;
	description: string | React.ReactNode;
	colTitle: string;
	id?: string;
}

const CollapsibleWrapper: React.FC<CollapsibleWrapperProps> = ({
	children,
	title,
	subTitle,
	description,
	colTitle,
	id,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div
			id={id}
			className="max-w-[1050px] lg:px-0 px-4 pt-0 lg:pt-8 mx-auto flex items-center"
		>
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<CollapsibleTrigger className="w-full">
					<div className="w-full bg-black px-4 lg:px-6 py-4 rounded-xl">
						<div className="w-full flex items-center justify-between text-white">
							<div className="flex items-start flex-col">
								<h3 className="lg:text-xl text-sm font-semibold">{title}</h3>
								<p className="lg:text-sm text-xs">{subTitle}</p>
							</div>
							<div className="flex lg:text-sm text-xs items-center gap-3">
								<span className="md:block hidden"> More details </span>
								<ChevronUp
									className={cn(
										'transition-transform duration-300',
										isOpen ? 'rotate-180' : 'rotate-0',
									)}
								/>
							</div>
						</div>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent
					className={cn(
						'overflow-hidden',
						'data-[state=closed]:animate-collapsible-up',
						'data-[state=open]:animate-collapsible-down',
					)}
				>
					<div className="px-6 py-6 space-y-2">
						<h1 className="lg:text-xl text-sm font-semibold">{colTitle}</h1>
						<p>{description}</p>
					</div>
				</CollapsibleContent>
				{children}
			</Collapsible>
		</div>
	);
};

export default CollapsibleWrapper;

interface SubscriptionTabOption {
	label: string;
	value: string;
	price: number;
	period: string;
	planId?: string;
}

export const SubscriptionPricingTabs = ({ handletoAddcart }: any) => {
	const tabs: SubscriptionTabOption[] = [
		{
			label: 'Month',
			value: 'Per Month',
			price: 400,
			period: '/ Per Month',
			planId: process.env.NEXT_PUBLIC_RAZOR_PLAN_ID_1,
		},
		{
			label: 'Half Year',
			value: 'Per Half Year',
			price: 2400,
			period: '/ Per Half Year',
			planId: process.env.NEXT_PUBLIC_RAZOR_PLAN_ID_2,
		},
		{
			label: 'Annual',
			value: 'Per Year',
			price: 4000,
			period: '/ Per Year',
			planId: process.env.NEXT_PUBLIC_RAZOR_PLAN_ID_3,
		},
	];

	const [activeTab, setActiveTab] = useState<string>(tabs[0].value);
	const router = useRouter();

	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	const userDetails = async () => {
		const response = await fetch(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/me',
			{
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
				},
			},
		);
		const data = await response.json();
		return data;
	};

	const handleSubscription = async (selectedTab: SubscriptionTabOption) => {
		const isLogin =
			typeof window !== 'undefined' && sessionStorage.getItem('accessToken');

		if (!isLogin) {
			router.push('/');
			return;
		}

		const { email, phone } = await userDetails();
		if (email === '' || phone === '') {
			toast.warning(
				'Please complete your profile first. Redirecting to profile in 5 seconds',
			);

			return setTimeout(() => {
				router.push('/profile/edit');
			}, 5000);
		}

		toast.info('Redirecing to payment Gateway. Hold on.');
		try {
			const createResponse = await fetch(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/create-subscription',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
					body: JSON.stringify({
						planId: selectedTab.planId,
						duration: selectedTab.value,
					}),
				},
			);

			if (!createResponse.ok) {
				throw new Error('Failed to create subscription');
			}
			const { subscriptionId, shortUrl } = await createResponse.json();

			const options = {
				key: process.env.NEXT_PUBLIC_RAZOR_API_KEY,
				subscription_id: subscriptionId,
				handler: async (response: any) => {
					try {
						const result = await fetch(
							process.env.NEXT_PUBLIC_API_ENDPOINT +
								'/api/auth/subscribe/newsletter',
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${sessionStorage.getItem(
										'accessToken',
									)}`,
								},
								body: JSON.stringify({
									subscriptionId: response.razorpay_subscription_id,
								}),
							},
						);

						if (result.ok) {
							toast.success(
								'Subscription Successful!. It could take few minutes to update',
							);
							setTimeout(() => router.push('/tenders'), 5000);
						} else {
							toast.error('Subscription Failed');
						}
					} catch (error) {
						toast.error('Subscription failed. Please try again.');
						console.error(error);
					}
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			toast.error('Failed to create subscription. Please try again.');
			console.error(error);
		}
	};

	return (
		<div className="flex items-center justify-center py-0">
			{/* Tabs */}
			<div className="py-1 rounded-lg">
				<div className="border px-2 rounded-lg items-center gap-4 w-max py-2 flex">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							className={`text-base px-6 py-2 rounded-md transition-colors ${
								activeTab === tab.value
									? 'bg-black text-white'
									: 'bg-transparent text-gray-700 hover:bg-gray-200'
							}`}
							onClick={() => handleTabChange(tab.value)}
						>
							{tab.label}
						</button>
					))}
				</div>
				{/* Tab Content */}
				{tabs.map(
					(tab) =>
						activeTab === tab.value && (
							<div
								key={tab.value}
								className="flex items-center justify-center text-[#0c1073] flex-col py-8 pt-12"
							>
								<h2>
									<span className="text-4xl font-semibold ">₹{tab.price}</span>
									<span>{tab.period}</span>
								</h2>
								<div className="flex pt-6 items-center justify-center gap-6 mt-4">
									<button
										onClick={() => handleSubscription(tab)}
										className="bg-gradient-to-r from-[#8d1db8] to-[#0c1073] text-white px-6 py-3 text-xl rounded-xl"
									>
										Subscribe Now
									</button>
									{/* <button
                    onClick={() =>
                      handletoAddcart(
                        "Per Tender Executive",
                        1000,
                        "Per Tender",
                        "tender"
                      )
                    }
                    className="text-black px-6 py-3 text-xl border-[#8d1db8] rounded-xl border"
                  >
                    Add to Cart
                  </button> */}
								</div>
							</div>
						),
				)}
			</div>
		</div>
	);
};

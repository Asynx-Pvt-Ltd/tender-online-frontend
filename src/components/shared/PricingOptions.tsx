'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

type PricingOptionProps = {
	price: number;
	duration: string;
};

const PricingOption: React.FC<PricingOptionProps> = ({ price, duration }) => {
	const [paymentAmount, setPaymentAmount] = useState<number>(price);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
	const router = useRouter();
	// Ensure Razorpay is loaded
	useEffect(() => {
		if (typeof window !== 'undefined' && window.Razorpay) {
			setIsRazorpayLoaded(true);
		} else {
			// Load Razorpay if it's not already loaded
			const script = document.createElement('script');
			script.src = 'https://checkout.razorpay.com/v1/checkout.js';
			script.onload = () => {
				setIsRazorpayLoaded(true);
			};
			script.onerror = () => {
				toast.error('Failed to load Razorpay SDK. Please try again.');
			};
			document.body.appendChild(script);
		}
	}, []);

	// Razorpay payment handler
	const handlePayment = () => {
		if (!isLogin) {
			router.push('/');
			return;
		}
		if (!isRazorpayLoaded) {
			toast.error('Razorpay SDK is not loaded yet. Please wait.');
			return;
		}

		const options = {
			key: 'rzp_test_ujFOlA5t7s0E09', // Use NEXT_PUBLIC for env vars in Next.js
			amount: paymentAmount * 100, // Razorpay amount is in paise
			currency: 'INR',
			name: 'Subscription Payment',
			description: `Pay ₹${paymentAmount} for ${duration}`,
			handler: async (response: any) => {
				try {
					const paymentId = response.razorpay_payment_id;
					const apiUrl =
						process.env.NEXT_PUBLIC_API_ENDPOINT + `/api/auth/success/payment`;

					const result = await fetch(apiUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
						},
						body: JSON.stringify({
							paymentId,
							amount: paymentAmount,
							duration: duration,
						}),
					});

					if (result.ok) {
						toast.success('Payment Successful!');
						router.push('/tenders');
					} else {
						toast.error('Payment Failed');
					}
				} catch (error) {
					toast.error('Payment failed. Please try again.');
					console.error(error);
				}
			},
			prefill: {
				name: 'John Doe', // Replace with dynamic user details
				email: 'john@example.com', // Replace with dynamic user email
			},
			theme: {
				color: '#F37254',
			},
		};

		const razorpay = new window.Razorpay(options);
		razorpay.open();
	};
	const isLogin =
		typeof window !== 'undefined' && sessionStorage.getItem('accessToken');
	return (
		<div className=" p-4 rounded-lg">
			<h2 className="text-xl font-semibold">Price: ₹{price}</h2>
			<p>{duration}</p>
			<button
				onClick={handlePayment}
				className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
				disabled={!isRazorpayLoaded} // Disable button until Razorpay is loaded
			>
				{/* {isRazorpayLoaded ? "Pay Now" : "Loading..."}{" "} */}
				{!isLogin ? 'Register to Subscribe' : 'Pay Now'}
			</button>
		</div>
	);
};

// Main component to display the pricing options
const PricingOptions: React.FC = () => {
	const pricingOptions = [
		{ price: 400, duration: 'Per Month' },
		{ price: 2400, duration: 'Per Half Year' },
		{ price: 4000, duration: 'Per Year' },
	];

	return (
		<div className="w-full flex-wrap flex text-center gap-16 py-6 justify-center items-center">
			{pricingOptions.map((option, index) => (
				<PricingOption
					key={index}
					price={option.price}
					duration={option.duration}
				/>
			))}
		</div>
	);
};

export default PricingOptions;

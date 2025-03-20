import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ShoppingCart = ({ carts, setCarts }: any) => {
	const calculateSubtotal = () => {
		return carts.reduce((acc: any, item: any) => acc + item.total, 0);
	};

	const calculatetotal = () => {
		return calculateSubtotal() * 0.18;
	};

	const formatCurrency = (amount: number): string => {
		return `₹${amount.toLocaleString('en-IN')}`;
	};

	const router = useRouter();
	const isLogin =
		typeof window !== 'undefined' && sessionStorage.getItem('accessToken');
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
	// Change handler for tabs

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
	const handlePayment = async () => {
		if (!isLogin) {
			toast.error('Please login to continue');
			router.push('/');
			return;
		}

		if (!isRazorpayLoaded) {
			toast.error('Razorpay SDK is not loaded yet. Please wait.');
			return;
		}

		// Calculate total payment dynamically from the cart
		var totalAmount = carts.reduce(
			(sum: any, item: any) => sum + item.total,
			0,
		);

		// 18 gst
		totalAmount += totalAmount * 0.18;
		const contentDescription = carts.map((item: any) => item.title).join(', ');

		const options = {
			key: process.env.NEXT_PUBLIC_RAZOR_API_KEY, // Use NEXT_PUBLIC for env vars in Next.js
			amount: totalAmount * 100, // Razorpay amount is in paise
			currency: 'INR',
			name: 'Subscription Payment',
			description: `Pay ₹${totalAmount} for: ${contentDescription}`,
			handler: async (response: any) => {
				const paymentId = response.razorpay_payment_id;

				// Process each cart item individually
				for (const item of carts) {
					try {
						const apiUrl =
							item.type === 'tender'
								? process.env.NEXT_PUBLIC_API_ENDPOINT +
								  `/api/auth/payment/success/executive`
								: process.env.NEXT_PUBLIC_API_ENDPOINT +
								  `/api/auth/success/payment`;

						const requestBody =
							item.type === 'tender'
								? {
										paymentId,
										amount_received: item.total,
										payment_method: 'Razorpay',
										transaction_status: 'Completed',
										total_amount_paid: item.total,
										content: item.title,
										item, // Include full item details for backend reference
								  }
								: {
										paymentId,
										amount: item.total,
										duration: item.teams, // Assuming 'teams' is relevant for non-tender items
								  };

						const result = await fetch(apiUrl, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${sessionStorage.getItem(
									'accessToken',
								)}`,
							},
							body: JSON.stringify(requestBody),
						});

						if (result.ok) {
							toast.success(`Payment for "${item.title}" Successful!`);
							setCarts([]);
						} else {
							toast.error(`Payment for "${item.title}" Failed.`);
						}
					} catch (error) {
						toast.error(
							`Payment for "${item.title}" failed. Please try again.`,
						);
						console.error(error);
					}
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

	return (
		<div id="cart" className="max-w-[1400px] mx-auto pt-10 px-4">
			<div className="bg-gradient-to-r from-[#8d1db8] to-[#0c1073] text-white px-6 py-4 text-xl font-bold">
				Shopping Cart
			</div>

			<div className="bg-white rounded-lg overflow-hidden mt-0">
				<table className="table-auto w-full text-left border-collapse">
					<thead className="font-bold">
						<tr>
							<th className="px-6 py-3 border-b text-sm font-semibold text-gray-700">
								Service
							</th>
							<th className="px-6 py-3 border-b text-sm font-semibold text-gray-700">
								Price
							</th>
							<th className="px-6 py-3 border-b text-sm font-semibold text-gray-700">
								Teams/Term
							</th>
							<th className="px-6 py-3 border-b text-sm font-semibold text-gray-700">
								Total
							</th>
							{/* remove option */}
						</tr>
					</thead>
					<tbody>
						{carts.map((item: any, index: any) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-6 py-4 border-b text-sm text-gray-800">
									{item.title}
								</td>
								<td className="px-6 py-4 border-b text-sm text-gray-800">
									{formatCurrency(item.price)}
								</td>
								<td className="px-6 py-4 border-b text-sm text-gray-800">
									{item.teams}
								</td>
								<td className="px-6 py-4 border-b text-sm text-gray-800">
									{formatCurrency(item.total)}
								</td>
								<td>
									<button
										onClick={() => {
											setCarts(
												carts.filter((cartItem: any) => cartItem !== item),
											);
										}}
										className="text-red-500"
									>
										Remove
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col  items-end justify-end space-y-4 mt-6 px-6">
				<div className="text-lg font-semibold text-gray-800">
					Subtotal: {formatCurrency(calculateSubtotal())}
				</div>
				<div className="text-lg font-semibold text-gray-800">
					Tax (18%): {formatCurrency(calculateSubtotal() * 0.18)}
				</div>
				<div className="text-lg font-semibold text-gray-800">
					total: {formatCurrency(calculateSubtotal() + calculatetotal())}
				</div>
				<button
					onClick={handlePayment}
					className="bg-gradient-to-r from-[#8d1db8] to-[#0c1073] text-white px-6 py-2 text-sm font-medium rounded-lg shadow-md hover:opacity-90 transition"
				>
					Proceed to Checkout
				</button>
			</div>
		</div>
	);
};

export default ShoppingCart;

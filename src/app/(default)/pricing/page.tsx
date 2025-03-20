'use client';
import CollapsibleWrapper, {
	SubscriptionPricingTabs,
} from '@/components/shared/collapsible-wrapper';
import Footer from '@/components/shared/footer';
import ShoppingCart from '@/components/shared/ShoppingCart';
import Header from '@/components/ui/header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const page = () => {
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);

	const [carts, setCarts] = useState<any[]>([]);

	const router = useRouter();
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

	const isLogin =
		typeof window !== 'undefined' && sessionStorage.getItem('accessToken');

	useEffect(() => {});
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

	const handlePayment = async (paymentAmount: any, duration: any) => {
		if (!isLogin) {
			toast.error('Please login to continue');
			router.push('/');
			return;
		}
		if (!isRazorpayLoaded) {
			toast.error('Razorpay SDK is not loaded yet. Please wait.');
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

		const options = {
			key: process.env.NEXT_PUBLIC_RAZOR_API_KEY, // Use NEXT_PUBLIC for env vars in Next.js
			amount: paymentAmount * 100, // Razorpay amount is in paise
			currency: 'INR',
			name: 'Subscription Payment',
			description: `Pay ₹${paymentAmount} for ${duration}`,
			handler: async (response: any) => {
				try {
					const paymentId = response.razorpay_payment_id;
					const apiUrl =
						process.env.NEXT_PUBLIC_API_ENDPOINT +
						`/api/auth/payment/success/executive`;

					const result = await fetch(apiUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
						},
						body: JSON.stringify({
							paymentId,
							amount_received: paymentAmount,
							price: paymentAmount,
							payment_method: 'Razorpay',
							transaction_status: 'Completed',
							total_amount_paid: paymentAmount,
							content: paymentAmount === 1000 ? 'Per Tender' : '10 Tender',
						}),
					});

					if (result.ok) {
						toast.success(
							'Payment Successful! soon we will get in touch with you with in 24 hours',
						);
						router.push('/tenders');
					} else {
						toast.error('Payment Failed');
					}
				} catch (error) {
					toast.error('Payment failed. Please try again.');
					console.error(error);
				}
			},
			theme: {
				color: '#F37254',
			},
		};

		const razorpay = new window.Razorpay(options);
		razorpay.open();
	};

	const handletoAddcart = (
		title: string,
		price: number,
		teams: string,
		type: string,
	) => {
		setCarts((prev: any) => {
			const isAlreadyInCart = prev.some(
				(item: any) => item.title === title && item.type === 'tender',
			);

			const isAlreadyinCartNews = prev.some(
				(item: any) => item.title === title && item.type === 'newsletter',
			);

			if (isAlreadyinCartNews) {
				toast.error('Already newsLetter Package added');
				return prev;
			}
			if (isAlreadyInCart) {
				toast.error('This tender is already in your cart.');
				// Optionally, you can show a newsletter or other UI instead
				// showNewsletter();
				return prev;
			}

			return [
				...prev,
				{
					title,
					price,
					teams,
					total: price,
					type,
				},
			];
		});
	};
	useEffect(() => {
		const cartSection = document.querySelector('#cart');
		cartSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [carts]);

	const handleScroll = (element: string) => {
		const cartSection = document.querySelector(element);
		cartSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
	return (
		<main>
			<Header />
			<div className="max-w-6xl pt-4 lg:pt-12 mx-auto px-4 sm:px-6 lg:px-8 mb-6 lg:mb-0">
				<div className="max-w-6xl px-4 sm:px-6 lg:py-12 md:py-2 mt-20 lg:px-8 mx-auto">
					<div className="mb-5 sm:mb-10 text-center">
						<h2 className="text-2xl font-bold lg:text-4xl lg:leading-tight dark:text-white">
							Get the Latest Tender Documents
						</h2>
						<p className="mt-3 text-gray-500 dark:text-neutral-400">
							with Value-for-Money Guaranteed Plans
						</p>
					</div>
					<div className="lg:flex grid grid-cols-2 items-center pb-5 justify-center gap-4 lg:gap-8 cursor-pointer">
						<div
							onClick={() => handleScroll('#newsletter')}
							className="hover:bg-[#222222] hover:text-white flex items-center gap-2 border rounded-3xl bg-gray-200 border-black border-opacity-10 px-4 py-1 text-xs lg:text-sm font-semibold"
						>
							<svg
								height="5px"
								width="5px"
								version="1.1"
								id="Capa_1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 31.955 31.955"
								fill="#000000"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g>
								<g id="SVGRepo_iconCarrier">
									<g>
										<path
											fill="#030104"
											d="M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3 c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z"
										></path>{' '}
										<path
											fill="#030104"
											d="M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416 C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375 C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672 C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137 C17.523,1.94,14.328,1.906,11.394,2.883z"
										></path>{' '}
										<circle
											fill="#030104"
											cx="15.979"
											cy="15.977"
											r="6.117"
										></circle>{' '}
									</g>{' '}
								</g>
							</svg>
							Newsletter Package
						</div>
						<div
							onClick={() => handleScroll('#package')}
							className="hover:bg-[#222222] hover:text-white cursor-pointer flex items-center gap-2 border rounded-3xl bg-gray-200 border-black border-opacity-10 px-4 py-1 text-xs lg:text-sm font-semibold"
						>
							<svg
								height="5px"
								width="5px"
								version="1.1"
								id="Capa_1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 31.955 31.955"
								fill="#000000"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g>
								<g id="SVGRepo_iconCarrier">
									<g>
										<path
											fill="#030104"
											d="M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3 c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z"
										></path>{' '}
										<path
											fill="#030104"
											d="M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416 C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375 C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672 C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137 C17.523,1.94,14.328,1.906,11.394,2.883z"
										></path>{' '}
										<circle
											fill="#030104"
											cx="15.979"
											cy="15.977"
											r="6.117"
										></circle>{' '}
									</g>{' '}
								</g>
							</svg>
							Tender Executive
						</div>
						{/* <div className="flex items-center gap-2 border rounded-3xl bg-gray-200 border-black border-opacity-10 px-4 py-1 text-xs lg:text-sm font-semibold">
              <svg
                height="5px"
                width="5px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 31.955 31.955"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <path
                      fill="#030104"
                      d="M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3 c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z"
                    ></path>{" "}
                    <path
                      fill="#030104"
                      d="M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416 C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375 C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672 C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137 C17.523,1.94,14.328,1.906,11.394,2.883z"
                    ></path>{" "}
                    <circle
                      fill="#030104"
                      cx="15.979"
                      cy="15.977"
                      r="6.117"
                    ></circle>{" "}
                  </g>{" "}
                </g>
              </svg>
              GeM Suite Package
            </div>
            <div className="flex items-center gap-2 border rounded-3xl bg-gray-200 border-black border-opacity-10 px-4 py-1 text-xs lg:text-sm font-semibold">
              <svg
                height="5px"
                width="5px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 31.955 31.955"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <path
                      fill="#030104"
                      d="M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3 c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z"
                    ></path>{" "}
                    <path
                      fill="#030104"
                      d="M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416 C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375 C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672 C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137 C17.523,1.94,14.328,1.906,11.394,2.883z"
                    ></path>{" "}
                    <circle
                      fill="#030104"
                      cx="15.979"
                      cy="15.977"
                      r="6.117"
                    ></circle>{" "}
                  </g>{" "}
                </g>
              </svg>
              Digital Signature
            </div> */}
					</div>
					{/* Buttons */}
					{/* <div className="gap-3 justify-center w-full flex">
            <Link
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white "
              href="/"
            >
              Get started
            </Link>
            <Link
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border   text-black "
              href="/contact"
            >
              Contact Sales
            </Link>

            <input
              type="hidden"
              id="downloadNpmCode"
              defaultValue="npm install preline"
            />
        </div> */}
				</div>
			</div>
			<CollapsibleWrapper
				id="newsletter"
				description={`Our team will gather tender information from multiple government sources and provide it to you. This service saves your valuable time and effort that would otherwise be spent searching for tenders. Many government sites lack user-friendly interfaces, but we ensure a seamless solution through our platform, making it easier for you to access and utilize the information. A special add-on "For you" tab has been specifically created containing only those relevant tenders that suits the specified company profile.`}
				colTitle={'  Tender information updated every day'}
				title={'Newsletter Package'}
				subTitle={'Tender information updated every day'}
			>
				<SubscriptionPricingTabs handletoAddcart={handletoAddcart} />
			</CollapsibleWrapper>
			<CollapsibleWrapper
				id="package"
				description={
					<div>
						<>
							<ol
								style={{
									marginTop: 0,
									marginBottom: 0,
									paddingInlineStart: 48,
								}}
							>
								<li
									dir="ltr"
									style={{
										listStyleType: 'decimal',
										fontSize: '13.999999999999998pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '-32.2pt',
									}}
									aria-level={1}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.295',
											marginTop: '0pt',
											marginBottom: '8pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Relevant Tender information through mail or whatsapp,
											along with dashboard update
										</span>
									</p>
								</li>
							</ol>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginTop: '0pt',
									marginBottom: '8pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									All the relevant tenders shall be retrieved from various
									governments sources and will be communicated to you through
									Mail or whatsapp.
								</span>
							</p>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginTop: '0pt',
									marginBottom: '8pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									Our team will get in touch weekly once to discuss on the
									potential tenders
								</span>
							</p>
							<ol
								style={{
									marginTop: 0,
									marginBottom: 0,
									paddingInlineStart: 48,
								}}
								start={2}
							>
								<li
									dir="ltr"
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '-32.2pt',
									}}
									aria-level={1}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.295',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Tender Bidding
										</span>
									</p>
								</li>
							</ol>
							<ol
								style={{
									marginTop: 0,
									marginBottom: 0,
									paddingInlineStart: 48,
								}}
							>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Acquiring the bidding documents from the respective
											department.
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Each tender document exceeds 100 pages; we commit to
											thoroughly reviewing them and presenting all necessary
											details in a simplified format for the clients
											convenience.
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											An extensive list of all necessary documents required for
											tender application shall be provided. This includes,
										</span>
									</p>
									<ol
										style={{
											marginTop: 0,
											marginBottom: 0,
											paddingInlineStart: 48,
										}}
									>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Documentary evidence of constitution of firm such as
													Memorandum of Articles, Partnership deed, etc.,.&nbsp;
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Duly attested copy of license
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Technical literature and other documents in support of
													the goods/ services.&nbsp;
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Documents validating current spare parts prices,&nbsp;
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Clause-by-clause commentary on the technical
													specifications
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Copies of audited Annual reports, balance sheets,
													profit and loss.
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													Bidders name, address, PAN, GST, etc.,.
												</span>
											</p>
										</li>
										<li
											dir="ltr"
											style={{
												listStyleType: 'lower-roman',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre',
												marginLeft: '12.799999999999997pt',
											}}
											aria-level={3}
										>
											<p
												dir="ltr"
												style={{
													lineHeight: '1.3800000000000001',
													marginRight: '-30.65pt',
													textAlign: 'justify',
													marginTop: '0pt',
													marginBottom: '0pt',
												}}
											>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
														color: '#0d0d0d',
														backgroundColor: '#ffffff',
														fontWeight: 400,
														fontStyle: 'normal',
														fontVariant: 'normal',
														textDecoration: 'none',
														verticalAlign: 'baseline',
														whiteSpace: 'pre-wrap',
													}}
												>
													The bidder's evaluation and qualification criteria
													documents.
												</span>
											</p>
										</li>
									</ol>
								</li>
							</ol>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginLeft: '108pt',
									marginRight: '-30.65pt',
									textAlign: 'justify',
									marginTop: '0pt',
									marginBottom: '8pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#0d0d0d',
										backgroundColor: '#ffffff',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									and&nbsp;
								</span>
							</p>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginRight: '-30.65pt',
									textAlign: 'justify',
									marginTop: '0pt',
									marginBottom: '8pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#0d0d0d',
										backgroundColor: '#ffffff',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
									&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; all the other
									requirements as specified in the respective tender.&nbsp;
								</span>
							</p>
							<ol
								style={{
									marginTop: 0,
									marginBottom: 0,
									paddingInlineStart: 48,
								}}
								start={4}
							>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											All pertinent documents received from the client will be
											meticulously filed with utmost confidentiality in
											preparation for submission along with&nbsp;
										</span>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											NDA.
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#0d0d0d',
												backgroundColor: '#ffffff',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											We will assist in proposal writing for the tender
											according to the client's preferences.
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Complete Analysis using&nbsp;
										</span>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											archive data to quote the bidding value
										</span>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											.
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 400,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 400,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											EMD payment procedures &amp; follow-up shall be
											coordinated with the client
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'lower-alpha',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '3.799999999999997pt',
									}}
									aria-level={2}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.3800000000000001',
											marginRight: '-30.65pt',
											textAlign: 'justify',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Assist in final submission of bid
										</span>
									</p>
								</li>
							</ol>
							<p>
								<br />
							</p>
							<ol
								style={{
									marginTop: 0,
									marginBottom: 0,
									paddingInlineStart: 48,
								}}
								start={3}
							>
								<li
									dir="ltr"
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '-32.2pt',
									}}
									aria-level={1}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.2',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Tender result update
										</span>
									</p>
								</li>
								<li
									dir="ltr"
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre',
										marginLeft: '-32.2pt',
									}}
									aria-level={1}
								>
									<p
										dir="ltr"
										style={{
											lineHeight: '1.2',
											marginTop: '0pt',
											marginBottom: '0pt',
										}}
									>
										<span
											style={{
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
												color: '#000000',
												backgroundColor: 'transparent',
												fontWeight: 700,
												fontStyle: 'normal',
												fontVariant: 'normal',
												textDecoration: 'none',
												verticalAlign: 'baseline',
												whiteSpace: 'pre-wrap',
											}}
										>
											Tender result analysis,
										</span>
									</p>
								</li>
							</ol>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginLeft: '3.8pt',
									marginTop: '0pt',
									marginBottom: '0pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									a. On Non-technical front
								</span>
							</p>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginLeft: '3.8pt',
									marginTop: '0pt',
									marginBottom: '0pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									For the tender results not in favor of us,&nbsp;
								</span>
							</p>
							<p
								dir="ltr"
								style={{
									lineHeight: '1.295',
									marginLeft: '3.8pt',
									marginTop: '0pt',
									marginBottom: '8pt',
								}}
							>
								<span
									style={{
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
										color: '#000000',
										backgroundColor: 'transparent',
										fontWeight: 700,
										fontStyle: 'normal',
										fontVariant: 'normal',
										textDecoration: 'none',
										verticalAlign: 'baseline',
										whiteSpace: 'pre-wrap',
									}}
								>
									We will inquire the resp. department to know the details and
									shall furnish a required summary to crack the next tender
								</span>
							</p>
						</>
					</div>
				}
				colTitle={'  Tender information updated every day'}
				title={'Tender Executive'}
				subTitle={'Executive Tender Processing Service'}
			>
				<div className="lg:px-0 px-4">
					<div className="lg:flex grid grid-cols-1 items-center  justify-around">
						<div className="flex items-center justify-center text-[#0c1073] flex-col py-8 pt-12">
							<h2>
								<span className="text-4xl font-semibold ">₹1000</span>
								<span>/ Tender</span>
							</h2>
							<div className="flex pt-6 items-center justify-center gap-6 mt-4">
								<button
									onClick={() => handlePayment(1000, 'Tender')}
									className="bg-gradient-to-r from-[#8d1db8] to-[#0c1073] text-white px-6 py-3 text-xl rounded-xl"
								>
									Buy Now
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
						<div className="flex items-center justify-center text-[#0c1073] flex-col py-8 pt-12">
							<h2>
								<span className="text-4xl font-semibold ">₹7000</span>
								<span>/ 10 Tender</span>
							</h2>
							<div className="flex pt-6 items-center justify-center gap-6 mt-4">
								<button
									onClick={() => handlePayment(7000, '10 Tender')}
									className="bg-gradient-to-r from-[#8d1db8] to-[#0c1073] text-white px-6 py-3 text-xl rounded-xl"
								>
									Buy Now
								</button>
								{/* <button
                  onClick={() =>
                    handletoAddcart(
                      "10 Tender Executive",
                      7000,
                      "10 Tender",
                      "tender"
                    )
                  }
                  className="text-black px-6 py-3 text-xl border-[#8d1db8] rounded-xl border"
                >
                  Add to Cart
                </button> */}
							</div>
						</div>
					</div>
				</div>
			</CollapsibleWrapper>
			<CollapsibleWrapper
				description={
					<div>
						<>
							<ol>
								<li
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
									}}
								>
									<p>
										<strong>
											<span
												style={{
													fontSize: '11pt',
													fontFamily: 'Calibri,sans-serif',
												}}
											>
												GeM registration
											</span>
										</strong>
									</p>
									<ol>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Pre-requisites
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Terms &amp; Conditions
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Registrations- PAN, Aadhar, Email, User credentials
													Once a Seller ID is created,
												</span>
											</p>
										</li>
									</ol>
								</li>
							</ol>
							<p>
								<br />
							</p>
							<ol start={2}>
								<li
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
									}}
								>
									<p>
										<strong>
											<span
												style={{
													fontSize: '11pt',
													fontFamily: 'Calibri,sans-serif',
												}}
											>
												Profile has to be created with the following details
												depending on the company type.
											</span>
										</strong>
									</p>
									<ol>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Organisation Profile
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Business PAN Validation &nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Business Details&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Additional Details&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Office Locations&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Bank Accounts&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													e-Invoicing&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Beneficial Ownership Compliance &nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Tax Assessment&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Logistics&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													TAN Validation
												</span>
											</p>
										</li>
									</ol>
								</li>
								<li
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
									}}
								>
									<p>
										<strong>
											<span
												style={{
													fontSize: '11pt',
													fontFamily: 'Calibri,sans-serif',
												}}
											>
												OEM Vendor Assessment Process Guidance
											</span>
										</strong>
									</p>
									<ol>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Assessments&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Assessment Exemption Documents&nbsp;
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														color: '#404040',
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Assessment Exemption
												</span>
											</p>
										</li>
									</ol>
								</li>
							</ol>
							<p>
								<br />
							</p>
							<ol start={4}>
								<li
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
									}}
								>
									<p>
										<strong>
											<span
												style={{
													fontSize: '11pt',
													fontFamily: 'Calibri,sans-serif',
												}}
											>
												Product/ Service catalogue listing, guidance &amp;
												management
											</span>
										</strong>
									</p>
									<ol>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Catalogue creation- Exisiting cateogory
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Catalogue creation- new cateogory| Custome catalogue
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Financials, Make/Model Specs, Prodcut description,
													Consignee, Reporting officer, EMD/PMG details,…
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Respective Image uploads
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<span
													style={{
														fontSize: '11pt',
														fontFamily: 'Calibri,sans-serif',
													}}
												>
													Respective Document uploads
												</span>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<strong>
													<span
														style={{
															fontSize: '11pt',
															fontFamily: 'Calibri,sans-serif',
														}}
													>
														Approval update
													</span>
												</strong>
											</p>
										</li>
									</ol>
								</li>
							</ol>
							<p>
								<br />
							</p>
							<ol start={5}>
								<li
									style={{
										listStyleType: 'decimal',
										fontSize: '11pt',
										fontFamily: 'Calibri,sans-serif',
									}}
								>
									<p>
										<strong>
											<span
												style={{
													fontSize: '11pt',
													fontFamily: 'Calibri,sans-serif',
												}}
											>
												Post AOC,
											</span>
										</strong>
									</p>
									<ol>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<strong>
													<span
														style={{
															fontSize: '11pt',
															fontFamily: 'Calibri,sans-serif',
														}}
													>
														Order Acceptance process guidance
													</span>
												</strong>
											</p>
										</li>
										<li
											style={{
												listStyleType: 'lower-alpha',
												fontSize: '11pt',
												fontFamily: 'Calibri,sans-serif',
											}}
										>
											<p>
												<strong>
													<span
														style={{
															fontSize: '11pt',
															fontFamily: 'Calibri,sans-serif',
														}}
													>
														Invoice generation proces
													</span>
												</strong>
											</p>
										</li>
									</ol>
								</li>
							</ol>
						</>
					</div>
				}
				colTitle={'  Tender information updated every day'}
				title={'Government e-Maket, GeMSuite Package'}
				subTitle={'For Efficient & Seemless government Tenders'}
			>
				<div className="flex">
					<div className="px-6 py-3 rounded-3xl">
						<div className="grid gap-3  grid-cols-1  lg:grid-cols-4">
							<div className="flex flex-col lg:py-0 py-8  rounded-lg bg-blue-100/20  lg:border-t-0 border-t h-full text-center">
								<div className=" flex items-center justify-center pt-8 pb-5 px-8 dark:bg-neutral-900">
									<svg
										width="60"
										height="60"
										viewBox="0 0 60 60"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M53.9515 10.6H4.38152C2.10152 10.6 0.231517 12.34 0.0215174 14.57C-0.0184826 14.95 0.0115174 13.2 0.00151741 45.06H58.3215V14.97C58.3215 12.57 56.3815 10.6 53.9515 10.6Z"
											fill="#ECF0F1"
										/>
										<path
											d="M29.8215 0C30.9215 0 31.8115 0.89 31.8115 1.99C31.8115 3.09 30.9215 3.98 29.8215 3.98C28.7215 3.98 27.8315 3.09 27.8315 1.99C27.8315 0.89 28.7215 0 29.8215 0Z"
											fill="#74829C"
										/>
										<path
											d="M7.95151 3.96997C9.41151 3.96997 10.6015 5.15997 10.6015 6.61997C10.6015 8.07997 9.41151 9.26997 7.95151 9.26997C6.49151 9.26997 5.30151 8.07997 5.30151 6.61997C5.30151 5.15997 6.49151 3.96997 7.95151 3.96997Z"
											fill="#74829C"
										/>
										<path
											d="M21.2115 17.23V33.14H21.1815C20.8515 29.42 17.7215 26.51 13.9215 26.51C15.3815 26.51 16.5715 25.32 16.5715 23.86C16.5715 22.4 15.3815 21.21 13.9215 21.21C12.4615 21.21 11.2715 22.4 11.2715 23.86C11.2715 25.32 12.4615 26.51 13.9215 26.51C10.1215 26.51 7.00153 29.42 6.66153 33.14H6.63153V17.23H21.2115Z"
											fill="#313A52"
										/>
										<path
											d="M13.9215 26.51C17.7215 26.51 20.8415 29.42 21.1815 33.14H6.6615C6.9915 29.42 10.1215 26.51 13.9215 26.51Z"
											fill="#65B2FE"
										/>
										<path
											d="M13.9215 21.2C15.3815 21.2 16.5715 22.39 16.5715 23.85C16.5715 25.31 15.3815 26.5 13.9215 26.5C12.4615 26.5 11.2715 25.31 11.2715 23.85C11.2715 22.39 12.4615 21.2 13.9215 21.2Z"
											fill="#FFD8A8"
										/>
										<path
											d="M58.2515 14.18C56.6115 16.81 53.7015 18.56 50.3715 18.56C45.7015 18.56 41.8315 15.1 41.1915 10.61C41.1315 10.18 41.0915 9.74 41.0915 9.28C41.0915 4.16 45.2415 0 50.3715 0C55.5015 0 59.6515 4.15 59.6515 9.28C59.6515 11.08 59.1415 12.76 58.2515 14.18Z"
											fill="#80AF52"
										/>
										<path
											d="M19.4915 1.70995C19.7315 1.94995 19.8815 2.27995 19.8815 2.64995C19.8815 3.01995 19.7315 3.34995 19.4915 3.58995C19.2515 3.82995 18.9215 3.97995 18.5515 3.97995C17.8215 3.97995 17.2215 3.38995 17.2215 2.64995C17.2215 2.27995 17.3715 1.94995 17.6115 1.70995C17.8515 1.46995 18.1815 1.31995 18.5515 1.31995C18.9215 1.31995 19.2515 1.46995 19.4915 1.70995Z"
											fill="#74829C"
										/>
										<path
											d="M38.4415 21.2H26.5115C25.7815 21.2 25.1815 20.61 25.1815 19.87C25.1815 19.13 25.7715 18.54 26.5115 18.54H38.4415C39.1715 18.54 39.7715 19.13 39.7715 19.87C39.7715 20.61 39.1815 21.2 38.4415 21.2Z"
											fill="#B3B3B3"
										/>
										<path
											d="M42.4115 25.18H26.5015C25.7715 25.18 25.1715 24.59 25.1715 23.85C25.1715 23.11 25.7615 22.52 26.5015 22.52H42.4115C43.1415 22.52 43.7415 23.11 43.7415 23.85C43.7415 24.59 43.1515 25.18 42.4115 25.18Z"
											fill="#B3B3B3"
										/>
										<path
											d="M46.3915 29.16H26.5115C25.7815 29.16 25.1815 28.57 25.1815 27.83C25.1815 27.09 25.7715 26.5 26.5115 26.5H46.3915C47.1215 26.5 47.7215 27.09 47.7215 27.83C47.7215 28.57 47.1315 29.16 46.3915 29.16Z"
											fill="#B3B3B3"
										/>
										<path
											d="M46.3915 33.1301H26.5115C25.7815 33.1301 25.1815 32.5401 25.1815 31.8001C25.1815 31.0601 25.7715 30.4701 26.5115 30.4701H46.3915C47.1215 30.4701 47.7215 31.0601 47.7215 31.8001C47.7215 32.5401 47.1315 33.1301 46.3915 33.1301Z"
											fill="#B3B3B3"
										/>
										<path
											d="M49.1115 14.58C48.7715 14.58 48.4315 14.45 48.1715 14.19L45.3615 11.38C44.8415 10.86 44.8415 10.02 45.3615 9.50999C45.8815 8.99 46.7215 8.99 47.2315 9.50999L49.1015 11.38L54.7215 5.76C55.2415 5.24 56.0815 5.24 56.5915 5.76C57.1115 6.28 57.1115 7.11999 56.5915 7.62999L50.0315 14.19C49.7715 14.45 49.4315 14.58 49.0915 14.58H49.1115Z"
											fill="white"
										/>
										<path
											d="M35.7915 58.71H22.5415C21.8115 58.71 21.2115 58.12 21.2115 57.38V51.55C21.2115 50.82 21.8015 50.22 22.5415 50.22C23.2815 50.22 23.8715 50.81 23.8715 51.55V56.06H34.4715V51.55C34.4715 50.82 35.0615 50.22 35.8015 50.22C36.5415 50.22 37.1315 50.81 37.1315 51.55V57.38C37.1315 58.11 36.5415 58.71 35.8015 58.71H35.7915Z"
											fill="#414A56"
										/>
										<path
											d="M40.4315 55.53C41.5315 55.53 42.4215 56.42 42.4215 57.52C42.4215 58.07 42.2015 58.57 41.8415 58.92C41.4815 59.28 40.9815 59.5 40.4415 59.5H17.9115C16.8115 59.5 15.9215 58.61 15.9215 57.51C15.9215 56.96 16.1415 56.46 16.5015 56.11C16.8615 55.75 17.3615 55.53 17.9015 55.53H40.4315Z"
											fill="#57606F"
										/>
										<path
											d="M58.3215 44.9301V47.1801C58.3215 49.6001 56.3615 51.5501 53.9515 51.5501H4.38153C1.96153 51.5601 0.00152588 49.6001 0.00152588 47.1801V44.9301H58.3215Z"
											fill="#57606F"
										/>
										<path
											d="M49.9815 55.92C50.2215 56.16 50.3715 56.49 50.3715 56.86C50.3715 57.23 50.2215 57.56 49.9815 57.8C49.7415 58.04 49.4115 58.19 49.0415 58.19C48.3115 58.19 47.7115 57.6 47.7115 56.86C47.7115 56.49 47.8615 56.16 48.1015 55.92C48.3415 55.68 48.6715 55.53 49.0415 55.53C49.4115 55.53 49.7415 55.68 49.9815 55.92Z"
											fill="#74829C"
										/>
										<path
											d="M7.57151 55.92C7.81151 56.16 7.96151 56.49 7.96151 56.86C7.96151 57.23 7.81151 57.56 7.57151 57.8C7.33151 58.04 7.00151 58.19 6.63151 58.19C5.90151 58.19 5.30151 57.6 5.30151 56.86C5.30151 56.49 5.45151 56.16 5.69151 55.92C5.93151 55.68 6.26151 55.53 6.63151 55.53C7.00151 55.53 7.33151 55.68 7.57151 55.92Z"
											fill="#74829C"
										/>
									</svg>
								</div>

								<div className=" flex justify-center lg:mt-px pt-7 px-8 dark:bg-neutral-900">
									<ul className="mt-7 space-y-2.5 text-sm">
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												GeM Profile
											</span>
										</li>
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												completion including
											</span>
										</li>
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												caution money deposit
											</span>
										</li>
									</ul>
								</div>
							</div>
							<div className="flex flex-col lg:py-0 py-8  rounded-lg bg-blue-100/20  lg:border-t-0 border-t h-full text-center">
								<div className=" flex items-center justify-center pt-8 pb-5 px-8 dark:bg-neutral-900">
									<svg
										width="74"
										height="59"
										viewBox="0 0 74 59"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M55.6 5.4301C57.53 5.8701 59.33 6.6201 60.95 7.6501L63.95 4.6501C66.05 6.1101 67.89 7.9401 69.34 10.0401L66.34 13.0401C67.36 14.6601 68.12 16.4601 68.56 18.3801H72.8C73.02 19.6201 73.14 20.9001 73.14 22.2001C73.14 23.5001 73.02 24.7701 72.8 26.0101H68.56C68.12 27.9301 67.37 29.7401 66.34 31.3501L69.34 34.3501C67.88 36.4601 66.05 38.2901 63.95 39.7501L60.95 36.7501C59.33 37.7701 57.53 38.5301 55.6 38.9701V43.2101C54.37 43.4401 53.09 43.5501 51.79 43.5501C50.49 43.5501 49.22 43.4401 47.98 43.2101V38.9701C46.06 38.5301 44.25 37.7701 42.63 36.7501L39.64 39.7501C37.53 38.2901 35.7 36.4601 34.24 34.3501L37.24 31.3601C36.22 29.7401 35.46 27.9401 35.02 26.0101H30.78C30.55 24.7701 30.44 23.5001 30.44 22.2001C30.44 20.9001 30.55 19.6201 30.78 18.3801H35.02C35.46 16.4601 36.22 14.6601 37.24 13.0401L34.24 10.0401C35.7 7.9401 37.53 6.1001 39.64 4.6501L42.63 7.6501C44.25 6.6301 46.05 5.8701 47.98 5.4301V1.1901C49.22 0.970097 50.49 0.850098 51.79 0.850098C53.09 0.850098 54.37 0.970097 55.6 1.1901V5.4301ZM51.79 12.0501C57.39 12.0501 61.93 16.5901 61.93 22.1901C61.93 27.7901 57.39 32.3301 51.79 32.3301C46.19 32.3301 41.65 27.7901 41.65 22.1901C41.65 16.5901 46.19 12.0501 51.79 12.0501Z"
											fill="#6C90B8"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M10.36 18.1801H32.98V40.8001H10.36V18.1801Z"
											fill="#FFC06C"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M25.03 27.8601V18.1801H18.31V27.8601L21.67 25.2901L25.03 27.8601Z"
											fill="#FF4C4C"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M25.03 27.8601V18.1801H21.67V25.3001L25.03 27.8701V27.8601Z"
											fill="#D11E1E"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M32.98 18.1801H55.6V40.8001H32.98V18.1801Z"
											fill="#FFC06C"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M47.66 27.8601V18.1801H40.94V27.8601L44.3 25.2901L47.66 27.8601Z"
											fill="#FF4C4C"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M30.25 18.1801H32.99V40.8001H30.25V18.1801Z"
											fill="#EDA558"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M47.66 27.8601V18.1801H44.3V25.3001L47.66 27.8701V27.8601Z"
											fill="#D11E1E"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M52.87 18.1801H55.6V40.8001H52.87V18.1801Z"
											fill="#EDA558"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.57004 40.8H56.41C61.17 40.8 65.07 44.69 65.07 49.46C65.07 54.23 61.17 58.1201 56.41 58.1201H9.57004C4.81004 58.1201 0.910034 54.22 0.910034 49.46C0.910034 44.7 4.81004 40.8 9.57004 40.8Z"
											fill="#4A5470"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M8.40002 42.75H55.24C55.79 42.75 56.34 42.8001 56.87 42.9001C60.86 43.6601 63.9 47.2001 63.9 51.4001C63.9 52.6101 63.65 53.77 63.19 54.82C64.37 53.34 65.07 51.4801 65.07 49.4501C65.07 44.8401 61.42 41.04 56.87 40.8C56.72 40.8 56.57 40.8 56.41 40.8H9.57004C6.02004 40.8 2.95003 42.9601 1.62003 46.0401C3.21003 44.0401 5.66002 42.75 8.40002 42.75Z"
											fill="#3E4864"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M24.12 45.54C26.28 45.54 28.04 47.29 28.04 49.45C28.04 51.61 26.28 53.37 24.12 53.37C21.96 53.37 20.21 51.61 20.21 49.45C20.21 47.29 21.96 45.54 24.12 45.54Z"
											fill="#252F4B"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M39.78 45.54C41.94 45.54 43.7 47.29 43.7 49.45C43.7 51.61 41.94 53.37 39.78 53.37C37.62 53.37 35.87 51.61 35.87 49.45C35.87 47.29 37.62 45.54 39.78 45.54Z"
											fill="#252F4B"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.10004 53.38C11.26 53.38 13.02 51.62 13.02 49.46C13.02 47.3 11.26 45.55 9.10004 45.55C6.94004 45.55 5.18002 47.31 5.18002 49.46C5.18002 51.61 6.94004 53.38 9.10004 53.38Z"
											fill="#252F4B"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M54.65 53.38C56.8 53.38 58.56 51.62 58.56 49.46C58.56 47.3 56.8 45.55 54.65 45.55C52.5 45.55 50.73 47.31 50.73 49.46C50.73 51.61 52.49 53.38 54.65 53.38Z"
											fill="#252F4B"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M25.23 45.54C27.39 45.54 29.14 47.29 29.14 49.45C29.14 51.61 27.39 53.37 25.23 53.37C23.07 53.37 21.31 51.61 21.31 49.45C21.31 47.29 23.07 45.54 25.23 45.54Z"
											fill="#F0F0FC"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M40.9 45.54C43.06 45.54 44.82 47.29 44.82 49.45C44.82 51.61 43.06 53.37 40.9 53.37C38.74 53.37 36.98 51.61 36.98 49.45C36.98 47.29 38.74 45.54 40.9 45.54Z"
											fill="#F0F0FC"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M10.21 53.38C12.36 53.38 14.12 51.62 14.12 49.46C14.12 47.3 12.36 45.55 10.21 45.55C8.06002 45.55 6.29004 47.31 6.29004 49.46C6.29004 51.61 8.05002 53.38 10.21 53.38Z"
											fill="#F0F0FC"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M55.76 53.38C57.92 53.38 59.68 51.62 59.68 49.46C59.68 47.3 57.92 45.55 55.76 45.55C53.6 45.55 51.85 47.31 51.85 49.46C51.85 51.61 53.61 53.38 55.76 53.38Z"
											fill="#F0F0FC"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M10.21 45.5402C12.37 45.5402 14.12 47.2902 14.12 49.4502C14.12 51.6102 12.37 53.3702 10.21 53.3702C10.02 53.3702 9.84002 53.3602 9.65002 53.3302C11.55 53.0602 13.01 51.4302 13.01 49.4502C13.01 47.4702 11.55 45.8402 9.65002 45.5702C9.83002 45.5402 10.02 45.5302 10.21 45.5302V45.5402Z"
											fill="#D7D7E3"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M55.76 45.5402C57.92 45.5402 59.68 47.2902 59.68 49.4502C59.68 51.6102 57.92 53.3702 55.76 53.3702C55.57 53.3702 55.39 53.3602 55.21 53.3302C57.11 53.0602 58.57 51.4302 58.57 49.4502C58.57 47.4702 57.11 45.8402 55.21 45.5702C55.39 45.5402 55.58 45.5302 55.76 45.5302V45.5402Z"
											fill="#D7D7E3"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M25.23 45.5402C27.39 45.5402 29.14 47.2902 29.14 49.4502C29.14 51.6102 27.39 53.3702 25.23 53.3702C25.04 53.3702 24.86 53.3602 24.68 53.3302C26.58 53.0602 28.04 51.4302 28.04 49.4502C28.04 47.4702 26.58 45.8402 24.68 45.5702C24.86 45.5402 25.05 45.5302 25.23 45.5302V45.5402Z"
											fill="#D7D7E3"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M40.9 45.5402C43.06 45.5402 44.82 47.2902 44.82 49.4502C44.82 51.6102 43.06 53.3702 40.9 53.3702C40.71 53.3702 40.53 53.3602 40.35 53.3302C42.25 53.0602 43.71 51.4302 43.71 49.4502C43.71 47.4702 42.25 45.8402 40.35 45.5702C40.53 45.5402 40.72 45.5302 40.9 45.5302V45.5402Z"
											fill="#D7D7E3"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M68.56 26.0101H66.64C66.2 27.9301 65.44 29.7401 64.42 31.3501L67.42 34.3501C66.22 36.0801 64.77 37.6301 63.12 38.9301L63.94 39.7501C66.04 38.2901 67.88 36.4601 69.33 34.3501L66.33 31.3501C67.35 29.7301 68.11 27.9301 68.55 26.0101H68.56ZM53.69 5.43005C55.61 5.87005 57.42 6.62005 59.04 7.65005L59.74 6.95005C58.45 6.28005 57.07 5.76005 55.61 5.43005V1.19005C54.98 1.08005 54.34 0.990054 53.69 0.930054V5.43005ZM67.43 10.0401L64.43 13.0401C65.45 14.6601 66.21 16.4601 66.65 18.3801H68.57C68.13 16.4601 67.38 14.6601 66.35 13.0401L69.35 10.0401C67.89 7.94005 66.06 6.10005 63.96 4.65005L63.14 5.46005C64.79 6.77005 66.24 8.31005 67.44 10.0401H67.43ZM72.8 18.3801H70.88C71.11 19.6201 71.22 20.9001 71.22 22.2001C71.22 23.5001 71.11 24.7701 70.88 26.0101H72.8C73.02 24.7701 73.14 23.5001 73.14 22.2001C73.14 20.9001 73.02 19.6201 72.8 18.3801Z"
											fill="#587AA1"
										/>
									</svg>
								</div>

								<div className=" flex justify-center h-[200px] lg:mt-px pt-7 px-8 dark:bg-neutral-900">
									<ul className="mt-7 space-y-2.5 text-sm">
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												OEM Vendor
											</span>
										</li>
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												Assesment Process
											</span>
										</li>
									</ul>
								</div>
							</div>
							<div className="flex flex-col lg:py-0 py-8  rounded-lg bg-blue-100/20  lg:border-t-0 border-t h-full text-center">
								<div className=" flex items-center justify-center pt-8 pb-5 px-8 dark:bg-neutral-900">
									<svg
										width="58"
										height="60"
										viewBox="0 0 58 60"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M57.69 31.2201C57.69 46.9001 44.98 59.6201 29.29 59.6201C13.6 59.6201 0.890015 46.9101 0.890015 31.2201C0.890015 15.5301 13.6 2.82007 29.29 2.82007C44.98 2.82007 57.69 15.5301 57.69 31.2201Z"
											fill="#FFCA51"
										/>
										<path
											d="M45.69 5.03003H37.67V8.51003C37.67 8.77003 37.46 8.97003 37.21 8.97003H15.65C15.39 8.97003 15.19 8.76003 15.19 8.51003V5.03003H7.16998C6.84998 5.03003 6.59003 5.29003 6.59003 5.61003V48.29C11.77 55.17 20.01 59.63 29.29 59.63C35.66 59.63 41.53 57.53 46.27 54V5.61003C46.27 5.29003 46.01 5.03003 45.69 5.03003Z"
											fill="#C67C4A"
										/>
										<path
											d="M8.38 5.61003C8.38 5.29003 8.64002 5.03003 8.96002 5.03003H7.15997C6.83997 5.03003 6.58002 5.29003 6.58002 5.61003V48.29C7.14002 49.04 7.74 49.76 8.38 50.44V5.61003Z"
											fill="#A5683F"
										/>
										<path
											d="M42.75 7.95996H37.67V8.49996C37.67 8.75996 37.46 8.95996 37.21 8.95996H15.65C15.39 8.95996 15.19 8.74996 15.19 8.49996V7.95996H10.11C9.78999 7.95996 9.53003 8.21996 9.53003 8.53996V51.61C11.64 53.65 14.06 55.37 16.71 56.69H41.88C42.38 56.44 42.86 56.19 43.34 55.91V8.53996C43.34 8.21996 43.08 7.95996 42.76 7.95996H42.75Z"
											fill="white"
										/>
										<path
											d="M13.09 8.53996C13.09 8.21996 13.35 7.95996 13.67 7.95996H10.1C9.77998 7.95996 9.52002 8.21996 9.52002 8.53996V51.61C10.63 52.68 11.82 53.67 13.09 54.55V8.53996Z"
											fill="#EEF6FF"
										/>
										<path
											d="M25.73 20.21H20.38V23.69H25.73C25.92 23.69 26.08 23.53 26.08 23.34V20.56C26.08 20.37 25.92 20.21 25.73 20.21Z"
											fill="#FFC987"
										/>
										<path
											d="M25.73 45.13H20.38V48.61H25.73C25.92 48.61 26.08 48.45 26.08 48.26V45.48C26.08 45.29 25.92 45.13 25.73 45.13Z"
											fill="#FFC987"
										/>
										<path
											d="M25.73 50.12H20.38V53.6H25.73C25.92 53.6 26.08 53.44 26.08 53.25V50.47C26.08 50.28 25.92 50.12 25.73 50.12Z"
											fill="#FFC987"
										/>
										<path
											d="M37.21 3.52002H32.34V5.61002C32.34 5.87002 32.13 6.07002 31.88 6.07002H20.98C20.72 6.07002 20.52 5.86002 20.52 5.61002V3.52002H15.65C15.33 3.52002 15.07 3.78002 15.07 4.10002V8.50002C15.07 8.82002 15.33 9.08002 15.65 9.08002H37.21C37.53 9.08002 37.79 8.82002 37.79 8.50002V4.10002C37.79 3.78002 37.53 3.52002 37.21 3.52002Z"
											fill="#A5683F"
										/>
										<path
											d="M18.62 8.50002V4.10002C18.62 3.78002 18.88 3.52002 19.2 3.52002H15.64C15.32 3.52002 15.06 3.78002 15.06 4.10002V8.50002C15.06 8.82002 15.32 9.08002 15.64 9.08002H19.2C18.88 9.08002 18.62 8.82002 18.62 8.50002Z"
											fill="#8E5935"
										/>
										<path
											d="M20.98 0.27002C20.66 0.27002 20.4 0.530019 20.4 0.850019V5.60002C20.4 5.92002 20.66 6.18002 20.98 6.18002H31.88C32.2 6.18002 32.46 5.92002 32.46 5.60002V0.850019C32.46 0.530019 32.2 0.27002 31.88 0.27002H20.98Z"
											fill="#EF9614"
										/>
										<path
											d="M22.22 5.61003V0.860029C22.22 0.540029 22.48 0.280029 22.8 0.280029H20.98C20.66 0.280029 20.4 0.540029 20.4 0.860029V5.61003C20.4 5.93003 20.66 6.19003 20.98 6.19003H22.8C22.48 6.19003 22.22 5.93003 22.22 5.61003Z"
											fill="#EF8318"
										/>
										<path
											d="M39.13 18.7C40.09 18.7 40.87 17.92 40.87 16.96C40.87 16.88 40.87 16.8 40.85 16.72L39.85 17.97C39.68 18.18 39.44 18.3 39.17 18.3C38.91 18.3 38.66 18.18 38.49 17.97L37.42 16.62C37.4 16.73 37.39 16.84 37.39 16.96C37.39 17.92 38.17 18.7 39.13 18.7Z"
											fill="#91E0E8"
										/>
										<path
											d="M38.66 15.38L39.18 16.03L39.74 15.33C39.55 15.26 39.35 15.22 39.14 15.22C38.95 15.22 38.78 15.25 38.61 15.3C38.63 15.32 38.65 15.35 38.67 15.37L38.66 15.38Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 15.23C12.14 15.23 11.98 15.39 11.98 15.58V18.36C11.98 18.55 12.14 18.71 12.33 18.71H20.38V15.23H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M38.66 20.37L39.18 21.02L39.74 20.32C39.55 20.25 39.35 20.21 39.14 20.21C38.95 20.21 38.78 20.24 38.61 20.29C38.63 20.31 38.65 20.34 38.67 20.36L38.66 20.37Z"
											fill="#91E0E8"
										/>
										<path
											d="M39.85 22.96C39.69 23.17 39.44 23.29 39.17 23.29C38.91 23.29 38.66 23.17 38.49 22.96L37.42 21.61C37.4 21.72 37.39 21.83 37.39 21.95C37.39 22.91 38.17 23.69 39.13 23.69C40.09 23.69 40.87 22.91 40.87 21.95C40.87 21.87 40.87 21.79 40.85 21.71L39.85 22.96Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 20.21C12.14 20.21 11.98 20.37 11.98 20.56V23.34C11.98 23.53 12.14 23.69 12.33 23.69H20.38V20.21H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M39.18 25.7701L39.59 25.2601C39.44 25.2201 39.29 25.2001 39.13 25.2001C39 25.2001 38.88 25.2201 38.75 25.2401L39.17 25.7701H39.18Z"
											fill="#91E0E8"
										/>
										<path
											d="M39.85 27.71C39.69 27.92 39.44 28.04 39.17 28.04C38.91 28.04 38.66 27.92 38.49 27.71L37.47 26.42C37.42 26.58 37.39 26.76 37.39 26.94C37.39 27.9 38.17 28.68 39.13 28.68C40.09 28.68 40.87 27.9 40.87 26.94C40.87 26.79 40.85 26.65 40.81 26.51L39.85 27.71Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 25.1901C12.14 25.1901 11.98 25.3501 11.98 25.5401V28.3201C11.98 28.5101 12.14 28.6701 12.33 28.6701H20.38V25.1901H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M25.73 25.1901H20.38V28.6701H25.73C25.92 28.6701 26.08 28.5101 26.08 28.3201V25.5401C26.08 25.3501 25.92 25.1901 25.73 25.1901Z"
											fill="#FFC987"
										/>
										<path
											d="M40.87 31.9201C40.87 32.8801 40.09 33.6601 39.13 33.6601C38.17 33.6601 37.39 32.8801 37.39 31.9201C37.39 30.9601 38.17 30.1801 39.13 30.1801C40.09 30.1801 40.87 30.9601 40.87 31.9201Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 30.1801C12.14 30.1801 11.98 30.3401 11.98 30.5301V33.3101C11.98 33.5001 12.14 33.6601 12.33 33.6601H20.38V30.1801H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M25.73 30.1801H20.38V33.6601H25.73C25.92 33.6601 26.08 33.5001 26.08 33.3101V30.5301C26.08 30.3401 25.92 30.1801 25.73 30.1801Z"
											fill="#FFC987"
										/>
										<path
											d="M40.87 36.9C40.87 37.86 40.09 38.64 39.13 38.64C38.17 38.64 37.39 37.86 37.39 36.9C37.39 35.94 38.17 35.16 39.13 35.16C40.09 35.16 40.87 35.94 40.87 36.9Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 35.16C12.14 35.16 11.98 35.32 11.98 35.51V38.29C11.98 38.48 12.14 38.64 12.33 38.64H20.38V35.16H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M25.85 35.16H22.31V38.64H25.85C25.98 38.64 26.08 38.48 26.08 38.29V35.51C26.08 35.32 25.98 35.16 25.85 35.16Z"
											fill="#FFC987"
										/>
										<path
											d="M40.87 41.89C40.87 42.85 40.09 43.63 39.13 43.63C38.17 43.63 37.39 42.85 37.39 41.89C37.39 40.93 38.17 40.15 39.13 40.15C40.09 40.15 40.87 40.93 40.87 41.89Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 40.15C12.14 40.15 11.98 40.31 11.98 40.5V43.28C11.98 43.47 12.14 43.63 12.33 43.63H20.38V40.15H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M25.73 40.15H20.38V43.63H25.73C25.92 43.63 26.08 43.47 26.08 43.28V40.5C26.08 40.31 25.92 40.15 25.73 40.15Z"
											fill="#FFC987"
										/>
										<path
											d="M40.87 46.87C40.87 47.83 40.09 48.61 39.13 48.61C38.17 48.61 37.39 47.83 37.39 46.87C37.39 45.91 38.17 45.13 39.13 45.13C40.09 45.13 40.87 45.91 40.87 46.87Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 45.13C12.14 45.13 11.98 45.29 11.98 45.48V48.26C11.98 48.45 12.14 48.61 12.33 48.61H20.38V45.13H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M40.87 51.85C40.87 52.81 40.09 53.59 39.13 53.59C38.17 53.59 37.39 52.81 37.39 51.85C37.39 50.89 38.17 50.11 39.13 50.11C40.09 50.11 40.87 50.89 40.87 51.85Z"
											fill="#91E0E8"
										/>
										<path
											d="M12.33 50.12C12.14 50.12 11.98 50.28 11.98 50.47V53.25C11.98 53.44 12.14 53.6 12.33 53.6H20.38V50.12H12.33Z"
											fill="#FFE2B8"
										/>
										<path
											d="M35.96 18.36C35.96 18.55 35.8 18.71 35.61 18.71H27.67C27.48 18.71 27.32 18.55 27.32 18.36V15.58C27.32 15.39 27.48 15.23 27.67 15.23H35.61C35.8 15.23 35.96 15.39 35.96 15.58V18.36Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 23.34C35.96 23.53 35.8 23.69 35.61 23.69H27.67C27.48 23.69 27.32 23.53 27.32 23.34V20.56C27.32 20.37 27.48 20.21 27.67 20.21H35.61C35.8 20.21 35.96 20.37 35.96 20.56V23.34Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 28.3199C35.96 28.5099 35.8 28.6699 35.61 28.6699H27.67C27.48 28.6699 27.32 28.5099 27.32 28.3199V25.5399C27.32 25.3499 27.48 25.1899 27.67 25.1899H35.61C35.8 25.1899 35.96 25.3499 35.96 25.5399V28.3199Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 33.3099C35.96 33.4999 35.8 33.6599 35.61 33.6599H27.67C27.48 33.6599 27.32 33.4999 27.32 33.3099V30.5299C27.32 30.3399 27.48 30.1799 27.67 30.1799H35.61C35.8 30.1799 35.96 30.3399 35.96 30.5299V33.3099Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 38.29C35.96 38.48 35.8 38.64 35.61 38.64H27.67C27.48 38.64 27.32 38.48 27.32 38.29V35.51C27.32 35.32 27.48 35.16 27.67 35.16H35.61C35.8 35.16 35.96 35.32 35.96 35.51V38.29Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 43.28C35.96 43.47 35.8 43.63 35.61 43.63H27.67C27.48 43.63 27.32 43.47 27.32 43.28V40.5C27.32 40.31 27.48 40.15 27.67 40.15H35.61C35.8 40.15 35.96 40.31 35.96 40.5V43.28Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 48.26C35.96 48.45 35.8 48.61 35.61 48.61H27.67C27.48 48.61 27.32 48.45 27.32 48.26V45.48C27.32 45.29 27.48 45.13 27.67 45.13H35.61C35.8 45.13 35.96 45.29 35.96 45.48V48.26Z"
											fill="#D9EAFC"
										/>
										<path
											d="M35.96 53.25C35.96 53.44 35.8 53.6 35.61 53.6H27.67C27.48 53.6 27.32 53.44 27.32 53.25V50.47C27.32 50.28 27.48 50.12 27.67 50.12H35.61C35.8 50.12 35.96 50.28 35.96 50.47V53.25Z"
											fill="#D9EAFC"
										/>
										<path
											d="M28.18 4.04005H24.67C24.19 4.04005 23.8 3.65005 23.8 3.17005C23.8 2.69005 24.19 2.30005 24.67 2.30005H28.18C28.66 2.30005 29.05 2.69005 29.05 3.17005C29.05 3.65005 28.66 4.04005 28.18 4.04005Z"
											fill="#DB722C"
										/>
										<path
											d="M22.63 12.97H17.33C16.85 12.97 16.46 12.58 16.46 12.1C16.46 11.62 16.85 11.23 17.33 11.23H22.63C23.11 11.23 23.5 11.62 23.5 12.1C23.5 12.58 23.11 12.97 22.63 12.97Z"
											fill="#85A0DD"
										/>
										<path
											d="M35.52 12.97H24.98C24.5 12.97 24.11 12.58 24.11 12.1C24.11 11.62 24.5 11.23 24.98 11.23H35.52C36 11.23 36.39 11.62 36.39 12.1C36.39 12.58 36 12.97 35.52 12.97Z"
											fill="#85A0DD"
										/>
										<path
											d="M51.68 20.24H48.18C48.18 20.24 48.18 20.24 48.17 20.24V43.86C48.17 44.18 48.28 44.69 48.41 44.99L49.24 46.88H50.63L51.46 44.99C51.59 44.69 51.7 44.18 51.7 43.86V20.24C51.7 20.24 51.7 20.24 51.69 20.24H51.68Z"
											fill="white"
										/>
										<path
											d="M50.63 46.87L50.81 46.46L50.16 44.98C50.03 44.68 49.92 44.17 49.92 43.85V20.24H48.18C48.18 20.24 48.18 20.24 48.17 20.24V43.86C48.17 44.18 48.28 44.69 48.41 44.99L49.24 46.88H50.63V46.87Z"
											fill="#EEF6FF"
										/>
										<path
											d="M49.17 46.73L49.69 47.92C49.82 48.22 50.03 48.22 50.16 47.92L50.68 46.73H49.16H49.17Z"
											fill="#293D7C"
										/>
										<path
											d="M47.6 8.27006C47.6 7.95006 47.86 7.69006 48.18 7.69006H51.68C52 7.69006 52.26 7.95006 52.26 8.27006V19.7701C52.26 20.0901 52 20.3501 51.68 20.3501H48.18C47.86 20.3501 47.6 20.0901 47.6 19.7701V8.27006Z"
											fill="#2DA1DC"
										/>
										<path
											d="M49.43 19.7701V8.27006C49.43 7.95006 49.69 7.69006 50.01 7.69006H48.18C47.86 7.69006 47.6 7.95006 47.6 8.27006V19.7701C47.6 20.0901 47.86 20.3501 48.18 20.3501H50.01C49.69 20.3501 49.43 20.0901 49.43 19.7701Z"
											fill="#1E8BC2"
										/>
										<path
											d="M49.93 18.02C49.44 18.02 49.04 17.62 49.04 17.14V10.3C49.04 9.81004 49.44 9.42004 49.93 9.42004C50.42 9.42004 50.81 9.82004 50.81 10.3V17.14C50.81 17.63 50.41 18.02 49.93 18.02Z"
											fill="#91E0E8"
										/>
										<path
											d="M39.17 18.3001C38.91 18.3001 38.66 18.1801 38.49 17.9701L37.3 16.4601C37 16.0801 37.07 15.5401 37.44 15.2401C37.82 14.9401 38.36 15.0101 38.66 15.3801L39.18 16.0301L40.55 14.3201C40.85 13.9501 41.4 13.8801 41.77 14.1801C42.14 14.4801 42.21 15.0301 41.91 15.4001L39.86 17.9601C39.7 18.1701 39.45 18.2901 39.18 18.2901L39.17 18.3001Z"
											fill="#293D7C"
										/>
										<path
											d="M39.17 23.28C38.91 23.28 38.66 23.16 38.49 22.95L37.3 21.44C37 21.06 37.07 20.52 37.44 20.22C37.82 19.92 38.36 19.99 38.66 20.36L39.18 21.01L40.55 19.3C40.85 18.93 41.4 18.86 41.77 19.16C42.14 19.46 42.21 20.01 41.91 20.38L39.86 22.94C39.7 23.15 39.45 23.27 39.18 23.27L39.17 23.28Z"
											fill="#293D7C"
										/>
										<path
											d="M39.17 28.03C38.91 28.03 38.66 27.91 38.49 27.7L37.3 26.19C37 25.81 37.07 25.27 37.44 24.97C37.82 24.67 38.36 24.74 38.66 25.11L39.18 25.76L40.55 24.05C40.85 23.68 41.4 23.61 41.77 23.91C42.14 24.21 42.21 24.76 41.91 25.13L39.86 27.69C39.7 27.9 39.45 28.02 39.18 28.02L39.17 28.03Z"
											fill="#293D7C"
										/>
										<path
											d="M25.73 15.23H20.38V18.71H25.73C25.92 18.71 26.08 18.55 26.08 18.36V15.58C26.08 15.39 25.92 15.23 25.73 15.23Z"
											fill="#FFC987"
										/>
									</svg>
								</div>

								<div className=" flex justify-center  h-[200px] lg:mt-px pt-7 px-8 dark:bg-neutral-900">
									<ul className="mt-7 space-y-2.5 text-sm">
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												Product / Service catalogue listing, Guidance &
												Management
											</span>
										</li>
									</ul>
								</div>
							</div>
							<div className="flex flex-col lg:py-0 py-8  rounded-lg bg-blue-100/20  lg:border-t-0 border-t h-full text-center">
								<div className=" flex items-center justify-center pt-8 pb-5 px-8 dark:bg-neutral-900">
									<svg
										width="56"
										height="61"
										viewBox="0 0 56 61"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M46.22 7.80997V24.71C40.36 27.18 34.04 28.4 27.68 28.3C21.32 28.4 15 27.18 9.14001 24.71V1.94997C9.14001 1.40997 9.58 0.969971 10.12 0.969971H39.39L46.22 7.79997V7.80997Z"
											fill="#F2F2F2"
										/>
										<path
											d="M39.39 0.97998V6.82998C39.39 7.36998 39.83 7.80998 40.37 7.80998H46.22L39.39 0.97998Z"
											fill="#D9D9D9"
										/>
										<path
											d="M42.63 49.44L25.61 38.78L19.87 36.59C18.29 36.23 16.81 35.54 15.52 34.56L16.2 33.38L8.96002 29.27L0.51001 43.91L7.71002 48.02L8.47998 46.67L11.98 49.25L25.37 57.18L28.79 59.25C29.72 59.79 30.92 59.48 31.46 58.55C31.63 58.25 31.72 57.92 31.73 57.57C31.73 56.9 31.38 56.27 30.81 55.91L32.45 56.89C33.28 57.57 34.51 57.45 35.2 56.62C35.88 55.79 35.76 54.56 34.93 53.87C34.8 53.76 34.65 53.67 34.5 53.6L36.17 54.58C37 55.27 38.23 55.17 38.92 54.34C39.61 53.51 39.51 52.28 38.68 51.59C38.51 51.45 38.33 51.34 38.12 51.26L40.61 52.75C41.52 53.31 42.72 53.03 43.28 52.12C43.46 51.83 43.56 51.49 43.56 51.14C43.56 50.45 43.21 49.8 42.61 49.44H42.63Z"
											fill="#FFD199"
										/>
										<path
											d="M12.6387 48.2668L11.216 50.3346C10.6963 51.0899 10.8873 52.1234 11.6426 52.6431L12.1039 52.9605C12.8592 53.4802 13.8927 53.2892 14.4124 52.5339L15.8352 50.4661C16.3549 49.7108 16.1638 48.6773 15.4086 48.1576L14.9472 47.8402C14.1919 47.3205 13.1584 47.5115 12.6387 48.2668Z"
											fill="#FFC780"
										/>
										<path
											d="M16.3963 49.6647L14.4293 52.5235C13.9097 53.2787 14.1007 54.3123 14.856 54.8319L15.3173 55.1494C16.0726 55.669 17.1061 55.4781 17.6258 54.7228L19.5927 51.8641C20.1124 51.1088 19.9214 50.0753 19.1661 49.5556L18.7048 49.2382C17.9495 48.7185 16.916 48.9095 16.3963 49.6647Z"
											fill="#FFC780"
										/>
										<path
											d="M19.5784 51.8601L18.1556 53.9279C17.6359 54.6832 17.8269 55.7167 18.5822 56.2364L19.0436 56.5538C19.7988 57.0735 20.8324 56.8825 21.3521 56.1272L22.7748 54.0594C23.2945 53.3041 23.1035 52.2706 22.3482 51.7509L21.8869 51.4335C21.1316 50.9138 20.098 51.1048 19.5784 51.8601Z"
											fill="#FFC780"
										/>
										<path
											d="M22.2277 54.872L21.3605 56.1324C20.8408 56.8877 21.0318 57.9213 21.7871 58.441L22.2484 58.7584C23.0037 59.2781 24.0373 59.087 24.5569 58.3317L25.4242 57.0713C25.9438 56.316 25.7529 55.2824 24.9976 54.7628L24.5362 54.4453C23.781 53.9257 22.7474 54.1167 22.2277 54.872Z"
											fill="#FFC780"
										/>
										<path
											d="M47.69 27.99L40.01 31.7L41.06 33.85C39.65 34.34 36.83 34.49 31.46 32.31C22.31 28.59 17.46 40.12 17.46 41.94C17.46 43.76 22.58 44.13 25.61 38.78L42.2 49.18C43.14 47.33 44.62 45.8 46.43 44.8L47.41 46.87L55.09 43.16L47.69 28V27.99Z"
											fill="#FFC780"
										/>
										<path
											d="M55.16 43.16L47.48 46.84L46.5 44.77C44.66 45.77 43.17 47.31 42.22 49.18L25.63 38.78C22.61 44.13 17.48 43.8 17.48 41.94C17.58 41.14 17.82 40.36 18.17 39.64C19.87 40.01 22.96 39.04 25.06 35.33L41.65 45.73C42.59 43.88 44.07 42.35 45.88 41.35L46.86 43.42L53.62 40.17L55.15 43.17L55.16 43.16Z"
											fill="#E6B373"
										/>
										<path
											d="M47.69 27.99L40.01 31.7L47.47 46.86L55.15 43.15L47.69 27.99Z"
											fill="#4D9AFF"
										/>
										<path
											d="M8.96997 29.27L16.17 33.38L7.71997 48.02L0.52002 43.91L8.96997 29.27Z"
											fill="#FF7375"
										/>
										<path
											d="M27.68 24.39C32.5291 24.39 36.46 20.459 36.46 15.61C36.46 10.7609 32.5291 6.82996 27.68 6.82996C22.8309 6.82996 18.9 10.7609 18.9 15.61C18.9 20.459 22.8309 24.39 27.68 24.39Z"
											fill="#67CC6D"
										/>
										<path
											d="M47.93 45.57L41.34 32.2L48.17 28.92L47.32 27.16L39.64 30.87C39.16 31.11 38.95 31.69 39.19 32.17L39.69 33.15C38.28 33.28 35.87 33.02 31.88 31.41C28.91 30.09 25.47 30.41 22.8 32.25C21.53 33.14 20.42 34.23 19.5 35.48C18.56 35.21 17.66 34.8 16.83 34.27L17.06 33.87C17.19 33.65 17.22 33.38 17.16 33.13C17.09 32.88 16.93 32.66 16.7 32.53L9.51001 28.42L8.53003 30.11L14.88 33.74L7.34998 46.68L1 43.05L0.0200195 44.74L7.17999 48.86C7.64999 49.12 8.24001 48.96 8.51001 48.5L8.73999 48.1L10.6 49.48L10.4 49.78C10.01 50.35 9.85998 51.05 9.97998 51.73C10.1 52.43 10.5 53.05 11.08 53.45L11.54 53.76C11.98 54.06 12.5 54.23 13.03 54.23C13.1 54.23 13.18 54.23 13.25 54.23C13.39 54.81 13.74 55.32 14.23 55.67L14.69 55.99C15.13 56.29 15.64 56.45 16.17 56.45C16.33 56.46 16.5 56.46 16.66 56.45C16.85 56.41 17.03 56.35 17.21 56.27C17.41 56.6 17.67 56.89 17.98 57.11L18.44 57.42C18.88 57.72 19.39 57.89 19.92 57.89H20.15C20.31 58.47 20.67 58.98 21.17 59.32L21.62 59.63C22.06 59.93 22.57 60.09 23.1 60.09C23.97 60.09 24.79 59.66 25.29 58.95L25.56 58.55L28.19 60.14C28.64 60.41 29.16 60.56 29.68 60.56C30.71 60.56 31.66 60.02 32.19 59.15C32.37 58.85 32.49 58.52 32.55 58.17C32.81 58.25 33.08 58.29 33.35 58.29C34.38 58.29 35.33 57.75 35.86 56.88C36.04 56.56 36.17 56.22 36.23 55.86C36.49 55.94 36.75 55.98 37.02 55.98C38.04 55.98 38.99 55.44 39.52 54.57C39.69 54.29 39.81 53.98 39.87 53.65L40.02 53.74C40.47 54.01 40.99 54.16 41.52 54.16C42.55 54.16 43.5 53.62 44.03 52.75C44.3 52.3 44.44 51.78 44.44 51.25C44.44 50.41 44.09 49.61 43.46 49.05C44.11 47.98 44.97 47.05 45.98 46.31L46.54 47.43C46.7 47.77 47.05 47.98 47.42 47.98C47.57 47.98 47.71 47.95 47.84 47.88L55.52 44.17L54.67 42.41L47.91 45.57H47.93ZM13.65 51.98C13.44 52.3 13 52.38 12.69 52.17C12.69 52.17 12.69 52.17 12.68 52.17L12.22 51.86C11.9 51.65 11.82 51.21 12.03 50.9C12.03 50.9 12.03 50.9 12.03 50.89L13.46 48.81C13.56 48.66 13.72 48.56 13.9 48.53C14.08 48.5 14.27 48.54 14.42 48.65L14.87 48.96C15.02 49.06 15.13 49.22 15.15 49.4C15.19 49.58 15.15 49.77 15.04 49.92L13.63 52.01L13.65 51.98ZM16.84 54.18C16.74 54.33 16.58 54.43 16.4 54.46C16.22 54.49 16.04 54.46 15.88 54.35L15.42 54.04C15.1 53.83 15.02 53.39 15.23 53.08C15.23 53.08 15.23 53.08 15.23 53.07L17.18 50.21C17.28 50.06 17.44 49.96 17.62 49.93H17.75C17.89 49.93 18.02 49.97 18.14 50.05L18.59 50.36C18.74 50.46 18.84 50.62 18.88 50.8C18.91 50.98 18.87 51.17 18.76 51.32L16.82 54.19L16.84 54.18ZM20.59 55.62C20.38 55.94 19.94 56.02 19.63 55.81C19.63 55.81 19.63 55.81 19.62 55.81L19.16 55.5C19.01 55.39 18.91 55.24 18.88 55.06C18.85 54.88 18.88 54.7 18.99 54.54L20.4 52.49C20.62 52.17 21.06 52.09 21.38 52.3L21.84 52.62C22.16 52.83 22.24 53.27 22.03 53.58C22.03 53.58 22.03 53.58 22.03 53.59L20.62 55.62H20.59ZM24.65 56.59L23.78 57.78C23.56 58.09 23.12 58.17 22.8 57.96L22.34 57.65C22.02 57.44 21.94 57 22.15 56.69C22.15 56.69 22.15 56.69 22.15 56.68L23.02 55.42C23.23 55.1 23.67 55.02 23.98 55.23C23.98 55.23 23.98 55.23 23.99 55.23L24.44 55.54C24.76 55.75 24.85 56.18 24.64 56.5C24.64 56.5 24.64 56.51 24.63 56.52V56.59H24.65ZM42.46 51.71C42.33 51.93 42.11 52.09 41.86 52.15C41.61 52.21 41.35 52.17 41.13 52.04L35.28 48.54L34.3 50.21L37.63 52.16C37.85 52.29 38.01 52.51 38.07 52.76C38.13 53.01 38.09 53.27 37.96 53.49C37.83 53.71 37.61 53.87 37.36 53.93C37.11 53.99 36.85 53.95 36.63 53.82L32.47 51.31L31.49 52.98L33.99 54.48C34.2 54.62 34.36 54.83 34.43 55.08C34.55 55.61 34.22 56.13 33.69 56.25C33.45 56.3 33.2 56.27 32.99 56.15L28.83 53.64L27.85 55.31L30.36 56.83C30.75 57.2 30.78 57.81 30.41 58.21C30.15 58.49 29.75 58.59 29.38 58.47L26.61 56.79C26.72 56.41 26.74 56.01 26.68 55.62C26.56 54.93 26.16 54.32 25.59 53.92L25.1 53.67C24.78 53.45 24.42 53.31 24.05 53.25C24.07 53.06 24.07 52.87 24.05 52.68C23.93 51.99 23.53 51.37 22.95 50.98L22.5 50.67C22 50.33 21.39 50.17 20.78 50.22C20.61 49.63 20.23 49.12 19.72 48.79L19.26 48.48C18.69 48.09 17.99 47.94 17.31 48.06C17.12 48.1 16.94 48.15 16.76 48.23C16.56 47.9 16.3 47.62 15.99 47.4L15.53 47.09C14.33 46.27 12.69 46.57 11.86 47.76L11.76 47.91L9.81 46.45L15.84 36.01C16.63 36.51 17.48 36.91 18.37 37.22C17.41 38.66 16.77 40.27 16.47 41.97C16.52 43.01 17.29 43.87 18.31 44.04C20.09 44.51 23.44 43.8 25.9 40.14L42.1 50.3C42.39 50.47 42.57 50.79 42.58 51.13C42.58 51.31 42.53 51.48 42.44 51.63V51.74L42.46 51.71ZM41.9 47.81L34.72 43.31C35.78 42.7 36.68 41.85 37.34 40.83L35.64 39.85C34.93 40.86 33.94 41.64 32.79 42.08L26.13 37.9C25.9 37.76 25.63 37.72 25.37 37.78C25.11 37.84 24.9 38.01 24.77 38.24C23.14 41.12 20.87 42.14 19.43 42.14C19.08 42.18 18.74 42.09 18.45 41.89C19.28 38.67 21.18 35.82 23.84 33.82C25.97 32.33 28.73 32.08 31.1 33.16C35.1 34.79 38.27 35.37 40.55 34.94L45.18 44.36C43.86 45.27 42.75 46.45 41.9 47.8V47.81Z"
											fill="black"
										/>
										<path
											d="M48.56 41.4001L50.5 40.4401L51.36 42.1901L49.42 43.1501L48.56 41.4001Z"
											fill="black"
										/>
										<path
											d="M47.19 24.39V7.81001C47.19 7.55001 47.09 7.30001 46.91 7.12001L40.08 0.29001C39.9 0.11001 39.65 0.0100098 39.39 0.0100098H10.12C9.04 0.0100098 8.16998 0.88001 8.16998 1.96001V25.38H10.12V1.95001H38.42V6.83001C38.42 7.91001 39.29 8.78001 40.37 8.78001H45.25V24.39H47.2H47.19ZM40.36 6.83001V3.33001L43.86 6.83001H40.36Z"
											fill="black"
										/>
										<path
											d="M17.92 15.61C17.92 21 22.29 25.37 27.68 25.37C33.07 25.37 37.44 21 37.44 15.61C37.44 10.22 33.07 5.84998 27.68 5.84998C22.29 5.84998 17.92 10.22 17.92 15.61ZM35.49 15.61C35.49 19.92 32 23.42 27.68 23.42C23.36 23.42 19.87 19.93 19.87 15.61C19.87 11.29 23.36 7.79998 27.68 7.79998C32 7.79998 35.49 11.29 35.49 15.61Z"
											fill="black"
										/>
										<path
											d="M24.06 15.47L22.67 16.86L25.09 19.27C25.47 19.65 26.09 19.65 26.47 19.27L32.69 13.06L31.3 11.71L25.79 17.23L24.06 15.46V15.47Z"
											fill="black"
										/>
									</svg>
								</div>

								<div className=" flex justify-center  h-[200px] lg:mt-px pt-7 px-8 dark:bg-neutral-900">
									<ul className="mt-7 space-y-2.5 text-sm">
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												Post AOC Ordeer Acceptance process guidance
											</span>
										</li>
										<li className="flex gap-x-2">
											<svg
												className="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
												xmlns="http://www.w3.org/2000/svg"
												width={24}
												height={24}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
											<span className="text-gray-800 dark:text-neutral-400">
												Invoice generation process
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-r rounded-md px-4 text-sm text-white from-[#8d1db8] font-semibold to-[#0c1073] py-4 text-center">
							<p>
								For More details Kindly{' '}
								<Link href="/about-us#contact" className="underline">
									Contact Us
								</Link>
							</p>
						</div>
					</div>
				</div>
			</CollapsibleWrapper>
			{carts?.length >= 1 && <ShoppingCart setCarts={setCarts} carts={carts} />}
			<Footer />
		</main>
	);
};

export default page;

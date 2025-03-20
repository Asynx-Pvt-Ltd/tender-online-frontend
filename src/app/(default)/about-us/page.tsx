'use client';
import Header from '@/components/ui/header';
import Link from 'next/link';
import React, { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
	{
		text: "Finding the right government tenders used to be overwhelming, but TenderOnline's platform changed everything for us. Their system is incredibly user-friendly and has saved us hours of searching. We’ve already secured new projects thanks to their tailored recommendations and couldn’t be happier with the results!",
		author: 'Sathish Kumar S.',
		position: 'Business Development Manager at CCTV Elite Vision, Chennai',
	},
	{
		text: 'The team at TenderOnline has been instrumental in helping us diversify our revenue streams. Their online platform provides relevant tenders in real-time, so we never miss an opportunity. It’s given us a competitive edge and has been invaluable for our growth.',
		author: 'Narendran',
		position: 'Managing Director, Infygru',
	},
	{
		text: 'Before using TenderOnline’s platform, we struggled to find tenders that aligned with our business. Their online service identifies tenders that are a perfect match, saving us time and effort. Thanks to them, we’ve won multiple contracts and opened new avenues for revenue!',
		author: 'Sanjeev',
		position: 'Business Operations Manager at B3DS',
	},
	{
		text: "We were new to government contracts, and TenderOnline's platform has been a game-changer. Their system automatically filters tenders based on our industry, making the search quick and precise. We’ve successfully bid on several projects we might have missed otherwise. Highly recommended!",
		author: 'David K.',
		position: 'Sales Director at BulkCorporate',
	},
	{
		text: 'What sets TenderOnline apart is their intuitive platform and dedicated support team. With their help, we’ve been able to target the right government contracts without wasting time. The platform has become an essential tool for us in generating new revenue streams.',
		author: 'Priya R.',
		position: 'Operations Head at Healthieyoo',
	},
];

const Page = () => {
	return (
		<div>
			<Header />
			{/* Hero */}
			<div className="max-w-[85rem] pt-6 lg:pt-24 mx-auto px-4 sm:px-6 lg:px-8">
				{/* Grid */}
				<div className="text-center flex pt-20 items-center justify-center gap-4 md:gap-8 xl:gap-20 md:items-center">
					<div>
						<h1 className="block text-2xl text-pretty md:text-3xl font-bold text-gray-800 sm:text-4xl lg:text-4xl lg:leading-tight dark:text-white">
							The People . The Government . The Business
						</h1>
						<p className="mt-4 lg:mt-3 text-sm lg:w-[650px] lg:ml-12 text-gray-800 dark:text-neutral-400 text-justify lg:text-center">
							Hassle free premium bidding experience to businesses in all
							categories and scale. We specialize in government tenders. Our
							main goal is to bring equal opportunity for businesses to compete
							in the government tendering arena.
						</p>
						{/* Buttons */}
						<div className="mt-7 justify-center flex gap-3 items-center">
							<Dialog>
								<DialogTrigger asChild>
									<button className="lg:py-3 px-0 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 disabled:opacity-50 disabled:pointer-events-none">
										<svg
											width="52"
											height="52"
											viewBox="0 0 52 52"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M26 47.6667C37.9662 47.6667 47.6666 37.9662 47.6666 26C47.6666 14.0338 37.9662 4.33334 26 4.33334C14.0338 4.33334 4.33331 14.0338 4.33331 26C4.33331 37.9662 14.0338 47.6667 26 47.6667Z"
												fill="#6183E4"
											/>
											<path
												d="M21.6667 17.3333L34.6667 26L21.6667 34.6667V17.3333Z"
												fill="#F8FAFC"
											/>
										</svg>
										View Demo
									</button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[903px] bg-white">
									<div className="grid gap-4 pt-4">
										<iframe
											width="853"
											height="480"
											src={`https://www.youtube.com/embed/1a1LnqGmZVc?si=bv8Ymgm4t4IBLqJC`}
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											title="Embedded youtube"
											className="rounded-md"
										/>
									</div>
									<DialogFooter>
										<DialogClose asChild>
											<Button type="submit">Close</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Link
								className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-[#F7CE46] text-black shadow-sm hover:bg-[#F7CE46] focus:outline-none  disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
								href="/pricing"
							>
								Pricing <ArrowRightIcon className="w-5 h-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-[85rem] w-full text-balance pt-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-3">
					<h2 className="text-2xl text-center font-bold md:text-3xl dark:text-white">
						Birth Of The Vision
					</h2>

					<p className="text-lg lg:pt-4 text-gray-800 text-justify mx-auto max-w-[1000px] dark:text-neutral-200 px-2 lg:px-0 font-mono">
						The foundation of our company and its vision emerged from the
						collaboration of two minds: Dr. J. Sai Shajan, a successful serial
						entrepreneur, and K. Sanjay, an alumnus of IIM Kashipur.
						<br />
						<br /> As part of our company's natural progression, we aimed to
						apply for government tenders to expand and diversify our revenue
						streams. However, during our efforts, we struggled to find anyone
						with a smooth or systematic experience in applying for and executing
						government tenders. Most could not create an effective system
						without incurring high costs or expecting a share of the profits.
						<br />
						<br />
						After researching the government tender process for some time, we
						discovered that the challenges stemmed from the various technical
						specifications mandated by different government departments and
						entities for the same work. These complexities in the application
						process are designed to filter out submissions, ensuring that only
						qualified bids meet the requirements set by the teams overseeing
						each entity.
						<br />
						<br />
						The government plays a crucial role in managing the daily lives of
						its citizens. Therefore, it is only logical that they impose
						stringent entry requirements to ensure that only the best companies,
						whether local or global, can compete to serve their communities.
						<br />
						<br />
						This does not imply that other companies lack quality or fail to
						meet standards. One significant barrier we observed was the
						hesitation of many firms to even attempt the process, largely due to
						the stigma surrounding it. Once a company meets all the requirements
						and we establish a systematic approach to bid applications, it
						becomes only a matter of time before they are selected for a tender.
						<br />
						<br />
						The government consistently requires high-quality vendors to deliver
						excellent services to its citizens.
						<br />
						<br /> By addressing this gap through our platform, we realized we
						could offer individuals more quality options and provide businesses
						with opportunities to generate additional revenue.
						<br />
						<br /> Thus, Tender Online was founded to fulfill this mission.
					</p>
				</div>
			</div>
			<div className="lg:pt-16 pt-10">
				<Testimonial />
			</div>
			<div
				className="max-w-[85rem] mt-10 lg:pt-16 mx-auto px-4 sm:px-6 lg:px-8"
				id="contact"
			>
				<div className="isolate flex lg:flex-row flex-col gap-5 items-center bg-white px-6 py-4 sm:py-0 lg:px-8 lg:py-6">
					<div className="flex-1">
						<div className="mx-auto  text-start">
							<h2 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-xl">
								Get in touch
							</h2>
							<p className="text-sm leading-8 text-gray-600">
								Our friendly team would love to hear from you.
							</p>
						</div>
						<ContactPage />
					</div>
					<div className="flex-[0.8] space-y-4">
						<div className="space-y-2 flex items-start flex-col gap-3">
							<div className="flex items-center gap-3">
								<MapPin />
								<span className="text-xl font-bold">Tender Online</span>
							</div>
							<span className="text-gray-500 ml-8">
								Block No.5, 1st Floor, Door No.19, Plot.5/2, Pari Salai,
								Mogappair East, Chennai, Tamil Nadu 600037
							</span>
						</div>{' '}
						<hr className="border-t pt-4" />
						<div className="space-y-2 flex items-start flex-col gap-2">
							<div className="flex items-center gap-3">
								<PhoneCall />
								<span className="text-xl font-bold">
									Call us (08:00 - 20:00)
								</span>
							</div>
							<Link
								href={'https://wa.me/+919003326686'}
								target="_blank"
								className="text-gray-500 ml-8 hover:text-black"
							>
								+91 90033 26686
							</Link>
						</div>{' '}
						<hr className="border-t pt-4" />
						<div className="space-y-2 flex items-start flex-col gap-2">
							<div className="flex items-center gap-3">
								<Mail />
								<span className="text-xl font-bold">Mail Us</span>
							</div>
							<Link
								href={'mailto:contact@tenderonline.co.in'}
								className="text-gray-500 ml-8 hover:text-black"
							>
								contact@tenderonline.co.in
							</Link>
						</div>{' '}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Page;

const Testimonial = () => {
	return (
		<div className="w-full max-w-6xl mx-auto">
			<h2 className="text-2xl lg:text-4xl font-bold text-center lg:mb-6 mb-4">
				What Our Clients Say
			</h2>
			<Carousel className="w-[90%] lg:w-full mx-auto">
				<CarouselContent>
					{testimonials.map((testimonial, index) => (
						<CarouselItem key={index} className="lg:p-4 lg:basis-1/3">
							<Card className="shadow-lg lg:h-[55vh] h-[50vh]">
								<CardContent className="p-6 h-full flex-col">
									<p className="text-lg text-gray-700 h-[250px] italic mb-10">
										"{testimonial.text}"
									</p>
									<div>
										<div className="text-sm font-semibold text-gray-900">
											— {testimonial.author}
										</div>
										<div className="text-sm text-gray-500">
											{testimonial.position}
										</div>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-100" />
				<CarouselNext className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-100" />
			</Carousel>
		</div>
	);
};

import Joi from 'joi';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Footer from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Mail, MapPin, PhoneCall } from 'lucide-react';

interface FormValues {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	type: string;
}

const formSchema = Joi.object({
	firstName: Joi.string().min(3).required().messages({
		'string.empty': 'First Name is required',
		'string.min': 'First Name must be at least 3 characters long',
	}),
	lastName: Joi.string().min(3).required().messages({
		'string.empty': 'Last Name is required',
		'string.min': 'Last Name must be at least 3 characters long',
	}),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.empty': 'Email is required',
			'string.email': 'Please enter a valid email address',
		}),
	message: Joi.string().min(10).required().messages({
		'string.empty': 'Message is required',
		'string.min': 'Message must be at least 10 characters long',
	}),
});

interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	type?: string;
}

const ContactPage: React.FC = () => {
	const [formData, setFormData] = useState<ContactFormData>({
		firstName: '',
		lastName: '',
		email: '',
		message: '',
		type: 'get-in-touch',
	});

	const [errors, setErrors] = useState<Partial<ContactFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<ContactFormData> = {};

		if (!formData.firstName.trim())
			newErrors.firstName = 'First name is required';
		if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!formData.email.trim()) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = 'Email is invalid';
		if (!formData.message.trim()) newErrors.message = 'Message is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/contact',
				formData,
			);
			toast.info('Details submitted successfully');
			// Reset form
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				message: '',
				type: 'get-in-touch',
			});
		} catch (error) {
			alert('Failed to send message. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto p-4">
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block mb-2">First Name</label>
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
						{errors.firstName && (
							<p className="text-red-500 text-sm">{errors.firstName}</p>
						)}
					</div>
					<div>
						<label className="block mb-2">Last Name</label>
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
						{errors.lastName && (
							<p className="text-red-500 text-sm">{errors.lastName}</p>
						)}
					</div>
				</div>

				<div className="mt-4">
					<label className="block mb-2">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email}</p>
					)}
				</div>

				<div className="mt-4">
					<label className="block mb-2">Message</label>
					<textarea
						name="message"
						value={formData.message}
						onChange={handleChange}
						className="w-full p-2 border rounded h-32"
					/>
					{errors.message && (
						<p className="text-red-500 text-sm">{errors.message}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					{isSubmitting ? 'Sending...' : 'Send Message'}
				</button>
			</form>
		</div>
	);
};

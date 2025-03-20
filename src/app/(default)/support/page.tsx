'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Footer from '@/components/shared/footer';
import Header from '@/components/ui/header';

const formSchema = z.object({
	firstName: z.string().min(2, {
		message: 'First name must be at least 2 characters.',
	}),
	clientId: z.string().optional(),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phoneNumber: z.string().min(10, {
		message: 'Phone number must be at least 10 digits.',
	}),
	subject: z.enum(
		['general-inquiry', 'technical-issue', 'tender-assistance', 'payment'],
		{
			required_error: 'Please select a subject.',
		},
	),
	message: z.string().min(10, {
		message: 'Message must be at least 10 characters.',
	}),
	type: z.literal('support'),
});

export default function SupportPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			clientId: '',
			email: '',
			phoneNumber: '',
			subject: 'general-inquiry',
			message: '',
			type: 'support',
		},
	});

	const submitSupportMessage = async (data: z.infer<typeof formSchema>) => {
		try {
			await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/contact',
				data,
			);
			return true;
		} catch (error) {
			console.error('Support message submission error:', error);
			toast.error('Failed to send message. Please try again.');
			return false;
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// Prevent multiple submissions
		if (isSubmitting) return;

		try {
			// Set submitting state immediately
			setIsSubmitting(true);

			// Attempt to submit the message
			const success = await submitSupportMessage(values);

			if (success) {
				// Show success toast
				toast.success('Message sent successfully');

				// Reset the form
				form.reset();
			}
		} catch (error) {
			// Handle any unexpected errors
			console.error('Unexpected error in form submission:', error);
			toast.error('An unexpected error occurred');
		} finally {
			// Always reset submitting state
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			<Header />
			<div className="container pt-36">
				<div className="text-center mt-6 mb-12">
					<h1 className="text-4xl font-bold tracking-tight mb-4">
						We&apos;re here to help!
					</h1>
					<p className="text-muted-foreground text-[20px] w-[600px] mx-auto">
						Whether you&apos;re new or experienced, our support team ensures a
						smooth and hassle-free experience for all your queries.
					</p>
				</div>

				<div className="flex bg-white px-4 py-4 border rounded-2xl lg:grid-cols-2 gap-8 max-w-6xl mx-auto h-[547px]">
					<div className="space-y-6 flex-[35%]">
						<Card className="bg-black h-full relative flex items-center justify-center text-white">
							<svg
								className="absolute bottom-2 right-2"
								width="182"
								height="145"
								viewBox="0 0 182 145"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g opacity="0.1" clip-path="url(#clip0_10_2)">
									<path
										d="M167.226 48.408L115.526 48.4177C107.069 48.4177 99.3858 51.8246 93.8377 57.3488C88.2896 62.8534 84.8521 70.4996 84.8521 78.8953L84.8912 78.9245V104.827H85.2879V106.307H84.8912V105.64H84.8716V129.922C84.8716 138.249 91.6635 145 100.037 145H135.133V144.966H151.336C159.783 144.966 167.466 141.54 173.005 136.025L172.975 135.996C178.513 130.477 181.961 122.884 181.961 114.527L182 114.488V63.0919C182 54.9834 175.384 48.408 167.226 48.408ZM152.453 114.479V114.488C152.453 114.819 152.32 115.063 152.125 115.262C151.904 115.476 151.625 115.598 151.326 115.598V115.608H119.389C116.642 115.598 114.419 113.388 114.419 110.663V105.64H114.355V78.8953C114.365 78.6082 114.522 78.321 114.728 78.1117C114.948 77.8976 115.227 77.7613 115.526 77.7613H147.277C150.146 77.7613 152.467 80.078 152.467 82.9204L152.453 114.479Z"
										fill="white"
									/>
									<path
										d="M108.744 0H4.99965C2.23295 0 0 2.22425 0 4.97415V27.0464C0 29.7914 2.23295 32.0156 4.99965 32.0156H40.7562V139.748C40.7562 142.654 43.1165 145 46.0399 145H67.6985C70.6072 145 72.9675 142.654 72.9675 139.748V32.0156H108.744C111.51 32.0156 113.758 29.7914 113.758 27.0464V4.97415C113.758 2.22425 111.51 0 108.744 0Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_10_2">
										<rect width="182" height="145" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<CardContent className="p-6 space-y-8">
								<div className="space-y-2">
									<h2 className="text-2xl font-semibold flex items-center gap-2">
										Email Support
									</h2>
									<p className="text-gray-300 flex items-center gap-4 text-sm">
										<Mail className="h-5 w-5" /> Reach us at
										contact@tenderonline.co.in <br /> for detailed assistance
									</p>
								</div>

								<div className="space-y-2">
									<h2 className="text-2xl font-semibold flex items-center gap-2">
										Call Support
									</h2>
									<p className="text-gray-300 flex items-center gap-3 text-sm">
										<Phone className="h-5 w-5" /> Call us at +91 90033 26686
										<br />
										during our business hours for quick help.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6 py-8 flex-[65%]"
						>
							<div className="grid sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter your first name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="clientId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Client ID (Optional)</FormLabel>
											<FormControl>
												<Input placeholder="Enter your client ID" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your email"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phoneNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your phone number"
													type="tel"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="subject"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel>Select Subject?</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="grid sm:grid-cols-4 gap-4"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="general-inquiry" />
													</FormControl>
													<FormLabel className="font-normal text-xs">
														General Inquiry
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="technical-issue" />
													</FormControl>
													<FormLabel className="font-normal text-xs">
														Technical Issue
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="tender-assistance" />
													</FormControl>
													<FormLabel className="font-normal text-xs">
														Tender Assistance
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="payment" />
													</FormControl>
													<FormLabel className="font-normal text-xs">
														Payment
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Write your message..."
												className="min-h-[120px] resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-end justify-end">
								<Button
									type="submit"
									className="px-6 py-4"
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Sending Message...' : 'Send Message'}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
			<div className="pt-[10vh]">
				<Footer />
			</div>
		</div>
	);
}

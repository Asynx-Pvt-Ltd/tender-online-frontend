'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Loading from '../ui/loading';

const ForgotPassword = ({ setIsLogin }: any) => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		otp: '',
	});
	const [step, setStep] = useState<number>(1);
	const [otp, setOtp] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		otp: '',
		general: '',
	});

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: '' });
	};

	const validateStep1 = () => {
		let formIsValid = true;
		const newErrors = { ...errors };

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = 'Email address is required';
			formIsValid = false;
		}

		// Password validation
		if (!formData.password.trim()) {
			newErrors.password = 'Password is required';
			formIsValid = false;
		}

		// Confirm Password validation
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			formIsValid = false;
		}

		setErrors(newErrors);
		return formIsValid;
	};

	const validateStep2 = () => {
		let formIsValid = true;
		const newErrors = { ...errors };

		// OTP validation
		if (!formData.otp.trim()) {
			newErrors.otp = 'OTP is required';
			formIsValid = false;
		}

		setErrors(newErrors);
		return formIsValid;
	};

	const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateStep1()) return;
		setIsLoading(true);

		try {
			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/otp',
				{
					email: formData.email,
				},
			);

			if (response.status === 200) {
				setOtp(response.data.result[0].otp);
				toast.success('OTP sent to your email');

				setStep(2); // Move to the OTP verification step
			} else {
				throw new Error('Failed to send OTP');
			}
		} catch (error: any) {
			console.error('Error sending OTP:', error);
			setErrors({
				...errors,
				general: 'Failed to send OTP. Please try again.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateStep2()) return;
		setIsLoading(true);

		try {
			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/forgot/password',
				{
					email: formData.email,
					password: formData.password,
				},
			);

			if (response.status === 200) {
				toast.success('Password reset successful');
				router.push('/');
			} else {
				throw new Error('OTP verification failed');
			}
		} catch (error: any) {
			console.error('Error verifying OTP:', error);
			setErrors({
				...errors,
				general: 'OTP verification failed. Please try again.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <Loading />;

	return (
		<div className="lg:mt-7 mt-44 w-[95%] lg:w-[80%]">
			<div className="bg-white border border-gray-200 rounded-3xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
				<div className="p-4 sm:p-12">
					<div className="text-center">
						<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
							{step === 1 ? 'Reset Password' : 'Verify OTP'}
						</h1>
					</div>
					<div className="mt-5">
						{/* Step 1: Email and New Password */}
						{step === 1 && (
							<form onSubmit={handleStep1Submit}>
								<div className="grid gap-y-4">
									<div>
										<input
											type="email"
											id="email"
											placeholder="Enter your email address"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className={`py-3 px-4 block w-full border ${
												errors.email ? 'border-red-500' : 'border-gray-200'
											} rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500`}
											aria-describedby="email-error"
										/>
										{errors.email && (
											<p className="text-xs text-red-600 mt-2" id="email-error">
												{errors.email}
											</p>
										)}
									</div>
									<div>
										<input
											type="password"
											placeholder="Enter your new password"
											name="password"
											value={formData.password}
											onChange={handleChange}
											className={`py-3 px-4 block w-full border ${
												errors.password ? 'border-red-500' : 'border-gray-200'
											} rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500`}
										/>
										{errors.password && (
											<p className="text-xs text-red-600 mt-2">
												{errors.password}
											</p>
										)}
									</div>
									<div>
										<input
											type="password"
											placeholder="Confirm your new password"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											className={`py-3 px-4 block w-full border ${
												errors.confirmPassword
													? 'border-red-500'
													: 'border-gray-200'
											} rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500`}
										/>
										{errors.confirmPassword && (
											<p className="text-xs text-red-600 mt-2">
												{errors.confirmPassword}
											</p>
										)}
									</div>
									{errors.general && (
										<p className="text-xs text-red-600 mt-2">
											{errors.general}
										</p>
									)}
									<div className="flex mt-4 items-center justify-center">
										<button
											type="submit"
											className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
										>
											Continue
										</button>
									</div>
								</div>
							</form>
						)}

						{/* Step 2: OTP Verification */}
						{step === 2 && (
							<form onSubmit={handleStep2Submit}>
								<div className="grid gap-y-4">
									<div>
										<input
											type="text"
											id="otp"
											placeholder="Enter the OTP"
											name="otp"
											value={formData.otp}
											onChange={handleChange}
											className={`py-3 px-4 block w-full border ${
												errors.otp ? 'border-red-500' : 'border-gray-200'
											} rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500`}
											aria-describedby="otp-error"
										/>
										{errors.otp && (
											<p className="text-xs text-red-600 mt-2" id="otp-error">
												{errors.otp}
											</p>
										)}
									</div>
									{errors.general && (
										<p className="text-xs text-red-600 mt-2">
											{errors.general}
										</p>
									)}
									<div className="flex mt-4 items-center justify-center">
										<button
											type="submit"
											className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
										>
											Verify OTP
										</button>
									</div>
								</div>
							</form>
						)}

						<div className="py-3 mt-0 flex items-center text-xs text-gray-400 uppercase">
							<p>© TenderOnline 2024</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;

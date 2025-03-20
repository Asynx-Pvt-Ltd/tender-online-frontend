'use client';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

// Define types for form data
type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

// Validation schema using Yup
const schema = yup.object().shape({
	currentPassword: yup.string().required('Current password is required'),
	newPassword: yup
		.string()
		.min(8, 'Password must be at least 8 characters')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/[0-9]/, 'Password must contain at least one number')
		.matches(
			/[!@#$%^&*(),.?":{}|<>]/,
			'Password must contain at least one special character',
		)
		.test(
			'not-same-as-current',
			'New password cannot be the same as your current password',
			function (value) {
				const currentPassword = this.parent.currentPassword;
				return value !== currentPassword;
			},
		)
		.required('New password is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
		.required('Please confirm your new password'),
});

const ChangePassword: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<ChangePasswordFormData>({
		resolver: yupResolver(schema),
	});

	// Watch the password field for changes
	const watchPassword = watch('newPassword', '');

	// Calculate password strength
	useEffect(() => {
		const calculateStrength = (password: string) => {
			if (!password) return 0;

			let strength = 0;
			if (password.length >= 8) strength += 1;
			if (/[A-Z]/.test(password)) strength += 1;
			if (/[0-9]/.test(password)) strength += 1;
			if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

			return strength;
		};

		setPasswordStrength(calculateStrength(watchPassword));
	}, [watchPassword]);

	const getStrengthColor = () => {
		if (passwordStrength === 0) return 'bg-gray-200';
		if (passwordStrength === 1) return 'bg-red-500';
		if (passwordStrength === 2) return 'bg-orange-500';
		if (passwordStrength === 3) return 'bg-yellow-500';
		return 'bg-green-500';
	};

	const getStrengthText = () => {
		if (passwordStrength === 0) return '';
		if (passwordStrength === 1) return 'Weak';
		if (passwordStrength === 2) return 'Moderate';
		if (passwordStrength === 3) return 'Good';
		return 'Strong';
	};

	const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/change-password',
				{
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
				},
			);

			toast.success('Password updated successfully');
			setSuccess(true);
			reset();
		} catch (error: any) {
			if (error.response) {
				if (error.response.status === 401) {
					setError('Current password is incorrect.');
					toast.error('Current password is incorrect');
				} else {
					setError(
						error.response.data.message ||
							'Failed to update password. Please try again.',
					);
					toast.error(
						error.response.data.message || 'Failed to update password',
					);
				}
			} else {
				setError('Failed to update password. Please try again.');
				toast.error('Failed to update password');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="p-6 lg:my-4 bg-white border h-fit
     w-full rounded-3xl"
		>
			<h2 className="text-2xl font-bold text-gray-700 mb-6">Change Password</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex flex-col">
					<label
						htmlFor="currentPassword"
						className="text-gray-700 font-medium"
					>
						Current Password
					</label>
					<div className="relative">
						<input
							type={showCurrentPassword ? 'text' : 'password'}
							id="currentPassword"
							{...register('currentPassword')}
							className={`w-full mt-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
								errors.currentPassword ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						<button
							type="button"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
						>
							{showCurrentPassword ? <Eye /> : <EyeOff />}
						</button>
					</div>
					{errors.currentPassword && (
						<span className="text-red-500 text-sm mt-1">
							{errors.currentPassword.message}
						</span>
					)}
				</div>

				<div className="flex flex-col">
					<label htmlFor="newPassword" className="text-gray-700 font-medium">
						New Password
					</label>
					<div className="relative">
						<input
							type={showNewPassword ? 'text' : 'password'}
							id="newPassword"
							{...register('newPassword')}
							className={`w-full mt-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
								errors.newPassword ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						<button
							type="button"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
						>
							{showNewPassword ? <Eye /> : <EyeOff />}
						</button>
					</div>

					{/* Password strength indicator */}
					{watchPassword && (
						<div className="mt-2">
							<div className="h-2 rounded-full bg-gray-200 w-full">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
									style={{ width: `${passwordStrength * 25}%` }}
								></div>
							</div>
							<div className="flex justify-between mt-1">
								<span className="text-sm text-gray-600">
									{getStrengthText()}
								</span>
							</div>
							<ul className="text-xs text-gray-600 mt-2 space-y-1">
								<li
									className={
										watchPassword.length >= 8
											? 'text-green-600'
											: 'text-gray-600'
									}
								>
									✓ At least 8 characters
								</li>
								<li
									className={
										/[A-Z]/.test(watchPassword)
											? 'text-green-600'
											: 'text-gray-600'
									}
								>
									✓ At least one uppercase letter
								</li>
								<li
									className={
										/[0-9]/.test(watchPassword)
											? 'text-green-600'
											: 'text-gray-600'
									}
								>
									✓ At least one number
								</li>
								<li
									className={
										/[!@#$%^&*(),.?":{}|<>]/.test(watchPassword)
											? 'text-green-600'
											: 'text-gray-600'
									}
								>
									✓ At least one special character
								</li>
							</ul>
						</div>
					)}

					{errors.newPassword && (
						<span className="text-red-500 text-sm mt-1">
							{errors.newPassword.message}
						</span>
					)}
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="confirmPassword"
						className="text-gray-700 font-medium"
					>
						Confirm New Password
					</label>
					<div className="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							{...register('confirmPassword')}
							className={`w-full mt-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
								errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
						>
							{showConfirmPassword ? <Eye /> : <EyeOff />}
						</button>
					</div>
					{errors.confirmPassword && (
						<span className="text-red-500 text-sm mt-1">
							{errors.confirmPassword.message}
						</span>
					)}
				</div>

				{error && <p className="text-red-500 text-sm">{error}</p>}
				{success && (
					<p className="text-green-500 text-sm">
						Password updated successfully!
					</p>
				)}

				<div className="flex justify-end">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
						disabled={loading || passwordStrength < 4}
					>
						{loading ? 'Updating...' : 'Change Password'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChangePassword;

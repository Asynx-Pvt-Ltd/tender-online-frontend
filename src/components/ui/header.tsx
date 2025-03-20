'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Menu, Text, rem } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

export function DropdownMenuDemo() {
	const router = useRouter();
	const handletoLogout = () => {
		sessionStorage.removeItem('accessToken');
		toast.success('Logout Successfully');
		router.push('/');
		window.location.reload();
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			try {
				const response = await axios.get(
					process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/me',
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
						},
					},
				);
				return response.data;
			} catch (error) {
				console.error('Error fetching profile:', error);
				return null;
			}
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error || !data) {
		return <div>Error loading profile</div>;
	}

	const image = data?.profile_image;
	const initials = data?.name
		? `${data.name.charAt(0)}${data.name.charAt(1) || ''}`
		: '??';

	return (
		<Menu shadow="lg" width={200}>
			<Menu.Target>
				<Avatar className="cursor-pointer border bg-black">
					<AvatarImage src={image || '/user.svg'} alt="@shadcn" />
					<AvatarFallback className="">{initials}</AvatarFallback>
				</Avatar>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Welcome {data.name || 'User'}</Menu.Label>
				<Menu.Item>
					<Text size="xs" color="gray">
						Client ID: {data.clientId || 'N/A'}
					</Text>
				</Menu.Item>

				<Menu.Item
					onClick={() => router.push('/profile/edit')}
					leftSection={
						<AvatarIcon style={{ width: rem(14), height: rem(14) }} />
					}
				>
					Profile
				</Menu.Item>

				<Menu.Item
					onClick={handletoLogout}
					color="red"
					leftSection={
						<IconLogout style={{ width: rem(14), height: rem(14) }} />
					}
				>
					Logout
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}

const Header = ({ isLogin1, setIsLogin1 }: any) => {
	const [isLogin, setIsLogin] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem('accessToken');
		if (token) {
			setIsLogin(true);
		} else {
			setIsLogin(false);
		}
	}, []);

	return (
		<div className="relative">
			<div className="absolute z-40 top-0 right-0 left-0 px-2 md:px-4 lg:px-24 pt-4">
				<div className="border bg-white rounded-xl px-2 md:px-6 py-2 w-full shadow-lg">
					<div className="flex flex-col md:flex-row justify-between">
						<div className="flex items-center justify-between md:justify-start">
							<div className="flex items-center gap-2">
								<Link href="/">
									<img src="/logo.png" className="h-8 lg:h-12" alt="Logo" />
								</Link>
								<hr className="border-t rotate-90 h-6 w-6 md:w-10 hidden md:block" />
							</div>

							<button
								className="md:hidden p-2"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d={
											isMenuOpen
												? 'M6 18L18 6M6 6l12 12'
												: 'M4 6h16M4 12h16M4 18h16'
										}
									/>
								</svg>
							</button>
						</div>

						<div
							className={`${
								isMenuOpen ? 'flex' : 'hidden'
							} md:hidden flex-col space-y-4 py-4`}
						>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/"
							>
								Home
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/about-us"
							>
								About Us
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/pricing"
							>
								Pricing
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/blog"
							>
								Blog
							</Link>

							{isLogin && (
								<Link
									href="/tenders"
									className="border text-center text-sm font-semibold text-[#0c1073] border-[#0c1073] rounded-xl px-4 py-2"
								>
									Tenders Dashboard
								</Link>
							)}

							{!isLogin && (
								<div className="flex flex-col space-y-2">
									<Dialog>
										<DialogTrigger className="px-4 py-2 text-sm font-semibold rounded-xl bg-black text-white w-full">
											Watch Demo
										</DialogTrigger>
										<DialogContent className="sm:max-w-[903px] bg-white">
											<DialogHeader>
												<DialogTitle>Watch Demo</DialogTitle>
												<DialogDescription>
													Get 3 Days Free Trial. No payment required
												</DialogDescription>
											</DialogHeader>
											<iframe
												width="100%"
												height="480"
												src="https://www.youtube.com/embed/1a1LnqGmZVc?si=bv8Ymgm4t4IBLqJC"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
												title="Embedded youtube"
												className="rounded-md"
											/>
										</DialogContent>
									</Dialog>
									<button
										className="rounded-xl px-4 py-2 bg-black text-white font-semibold text-sm w-full"
										onClick={() => {
											if (window.location.pathname !== '/') {
												window.location.href = '/';
											} else if (setIsLogin1 !== undefined) {
												setIsLogin1(!isLogin1);
											}
										}}
									>
										{isLogin1 ? 'Sign Up' : 'Sign In'}
									</button>
								</div>
							)}
						</div>

						<div className="hidden md:flex items-center gap-6">
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/"
							>
								Home
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/about-us"
							>
								About Us
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/pricing"
							>
								Pricing
							</Link>
							<Link
								className="text-sm font-sans text-gray-600 hover:text-gray-900"
								href="/blog"
							>
								Blog
							</Link>
						</div>

						<div className="hidden md:flex items-center space-x-4">
							{isLogin && (
								<Link
									href="/tenders"
									className="border text-center text-sm font-semibold text-[#0c1073] border-[#0c1073] rounded-xl px-4 py-2"
								>
									Tenders Dashboard
								</Link>
							)}

							{!isLogin && (
								<div className="flex gap-2">
									<Dialog>
										<DialogTrigger className="px-4 py-2 text-sm font-semibold rounded-xl bg-black text-white">
											Watch Demo
										</DialogTrigger>
										<DialogContent className="sm:max-w-[903px] bg-white">
											<DialogHeader>
												<DialogTitle>Watch Demo</DialogTitle>
												<DialogDescription>
													Get 3 Days Free Trial. No payment required
												</DialogDescription>
											</DialogHeader>
											<iframe
												width="853"
												height="480"
												src="https://www.youtube.com/embed/1a1LnqGmZVc?si=bv8Ymgm4t4IBLqJC"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
												title="Embedded youtube"
												className="rounded-md"
											/>
										</DialogContent>
									</Dialog>
									<button
										className="rounded-xl px-4 py-2 bg-black text-white font-semibold text-sm"
										onClick={() => {
											if (window.location.pathname !== '/') {
												window.location.href = '/';
											} else if (setIsLogin1 !== undefined) {
												setIsLogin1(!isLogin1);
											}
										}}
									>
										{isLogin1 ? 'Sign Up' : 'Sign In'}
									</button>
								</div>
							)}

							{isLogin && <DropdownMenuDemo />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;

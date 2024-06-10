'use client';
import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher/ThemeSwitcher';
import { cn } from '@/lib/utils';

const Header = () => {
	const { isAuthorized, user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const onClickLogout = async () => {
		const isLogoutConfirmed = window.confirm('Do you realy want to Log out?');
		if (isLogoutConfirmed) {
			dispatch(logout({ router }));
		}
	};
	console.log(user);
	return (
		<div className="w-full bg-black dark:bg-white sticky top-0 px-4 py-3 z-50">
			<div className="flex justify-between h-full items-center">
				<Link href="/" prefetch={false}>
					<Button variant="secondary">Blog</Button>
				</Link>
				<div className="flex">
					{isAuthorized && user ? (
						<div className="flex">
							<Link href="/post/create" prefetch={false}>
								<Button variant="secondary" className="mr-4">
									Add Post
								</Button>
							</Link>
							<Popover>
								<PopoverTrigger>
									<Avatar className="flex justify-center items-center group relative cursor-pointer bg-white dark:bg-black rounded-full mr-4">
										{user.avatar ? (
											<AvatarImage
												src={`${
													user.isSocial
														? user.avatar
														: process.env.NEXT_PUBLIC_USERS_UPLOAD_URI + user.avatar
												}`}
												className="pointer-events-none w-full h-full"
											/>
										) : (
											<FaUser className="absolute w-6 h-6 justify-center items-center dark:fill-white" />
										)}
									</Avatar>
								</PopoverTrigger>
								<PopoverContent className="w-auto">
									<div className="flex flex-col">
										{user.name}
										<div className="flex justify-between">
											<Button variant="destructive" className="mr-4" onClick={onClickLogout}>
												Log Out
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					) : (
						<Link
							href="/auth/signin"
							prefetch={false}
							className={cn('mr-4', buttonVariants({ variant: 'secondary' }))}>
							Sign In
						</Link>
					)}
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	);
};

export default Header;

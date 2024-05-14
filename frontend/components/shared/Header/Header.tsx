'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

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

	return (
		<div className="w-full bg-black sticky top-0 px-4 py-3 z-50">
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
									<Avatar className="group relative cursor-pointer bg-white rounded-full">
										{user.avatar ? (
											<AvatarImage
												src={`${process.env.NEXT_PUBLIC_USERS_UPLOAD_URI}${user.avatar}`}
												className="pointer-events-none w-full h-full"
											/>
										) : (
											<FaUser className="absolute w-full h-full justify-center items-center" />
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
						<Button variant="secondary" className="mr-4">
							<Link href="/signin" prefetch={false}>
								Sign In
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;

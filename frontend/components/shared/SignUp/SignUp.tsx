'use client';
import React, { useRef, useState, useEffect } from 'react';
import { HiOutlineXCircle } from 'react-icons/hi';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { signUp, googleAuth } from '@/lib/redux/slices/authSlice';
import TextBetweenSeparates from '@/components/shared/TextBetweenSeparates/TextBetweenSeparates';
import Image from 'next/image';

const validationSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: 'Name is required!' })
			.min(5, { message: 'Name is too short!' }),
		email: z
			.string()
			.min(1, { message: 'Email is required!' })
			.email({ message: 'Email is not valid!' }),
		password: z.string().min(1, { message: 'Password is required!' }),
		confirmPassword: z.string().min(1, { message: 'Confirm Password is required!' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Password don`t match!',
	});

type FormValueTypes = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const SignIn = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.auth);
	const { toast } = useToast();
	const [previewAvatar, setPreviewAvatar] = useState<undefined | string>(undefined);
	const [fileAvatar, setFileAvatar] = useState<null | File>(null);
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const form = useForm<FormValueTypes>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		resolver: zodResolver(validationSchema),
	});

	useEffect(() => {
		const cleanUp = () => {
			previewAvatar && window.URL.revokeObjectURL(previewAvatar);
		};
		if (fileAvatar) {
			const urlFile = window.URL.createObjectURL(fileAvatar);
			setPreviewAvatar(urlFile);
		}
		return cleanUp;
	}, [fileAvatar]);

	const onSubmit = (data: {
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}) => {
		const { confirmPassword, ...fields } = data;
		dispatch(signUp({ fields, avatar: fileAvatar, router }));
	};

	useEffect(() => {
		if (status === 'error') {
			toast({
				title: 'Error',
				description: `${new Date()}`,
				variant: 'destructive',
			});
		}
	}, [status]);

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.currentTarget && e?.currentTarget?.files && e?.currentTarget?.files[0];
		setFileAvatar(file);
	};

	const handleAvatarClick = () => {
		if (fileAvatar) {
			setFileAvatar(null);
			setPreviewAvatar(undefined);
			if (avatarInputRef?.current && avatarInputRef?.current?.value) {
				avatarInputRef.current.value = '';
			}
		} else {
			avatarInputRef && avatarInputRef?.current && avatarInputRef?.current.click();
		}
	};

	const handleGoogleAuth = async () => {
		await dispatch(googleAuth());
	};

	return (
		<Card>
			<CardContent className="p-8">
				<Button className="w-full justify-center mb-6 flex gap-2" onClick={handleGoogleAuth}>
					<Image
						width={26}
						height={26}
						src="/social/google-logo.webp"
						alt="Google logo"
						className="brightness-0 invert dark:invert-0"
					/>
					Google
				</Button>
				<TextBetweenSeparates text="OR" className="mb-6" />

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<Avatar
							className="group m-auto w-20 h-20 relative cursor-pointer"
							onClick={handleAvatarClick}>
							<AvatarImage
								src={previewAvatar}
								className="pointer-events-none group-hover:blur-md"
							/>
							{previewAvatar ? (
								<HiOutlineXCircle className="z-10 invisible pointer-events-none opacity-70 absolute w-full h-full justify-center items-center group-hover:visible" />
							) : (
								<HiOutlinePlusCircle className="z-10 invisible pointer-events-none opacity-70 absolute w-full h-full justify-center items-center group-hover:visible" />
							)}
							<AvatarFallback className="pointer-events-none relative">
								<FaUser className="p-5 absolute w-full h-full justify-center items-center group-hover:hidden" />
							</AvatarFallback>
						</Avatar>
						<input hidden type="file" ref={avatarInputRef} onChange={handleFileInputChange} />
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name..." {...field} />
									</FormControl>
									<FormDescription>This is your public display name.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Password..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Confirm Password..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit" loading={status === 'loading'}>
							Submit
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<span>I already have an account!</span>
				&nbsp;
				<Link href="/auth/signin" prefetch={false} className="font-bold">
					Sign In!
				</Link>
			</CardFooter>
		</Card>
	);
};

export default SignIn;

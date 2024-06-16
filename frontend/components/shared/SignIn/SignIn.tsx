'use client';
import React, { useEffect } from 'react';
// UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// react-hook-form
import { useForm } from 'react-hook-form';
// zod
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// next tools
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// redux hooks
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// redux
import { signIn, googleAuth } from '@/lib/redux/slices/authSlice';
// components
import TextBetweenSeparates from '@/components/shared/TextBetweenSeparates/TextBetweenSeparates';

const validationSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required!' })
		.email({ message: 'Email is not valid!' }),
	password: z.string().min(1, { message: 'Password is required!' }),
});

const SignIn = () => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isAuthorized, status } = useAppSelector((state) => state.auth);
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(validationSchema),
	});

	const onSubmit = async (fields: any) => {
		await dispatch(signIn({ fields, router }));
	};

	useEffect(() => {
		if (status === 'error') {
			toast({ title: 'Error', description: `${new Date()}`, variant: 'destructive' });
		}
	}, [status]);

	const handleGoogleAuth = async () => {
		await dispatch(googleAuth());
	};

	return (
		<Card>
			<CardContent className="p-8">
				<Form {...form}>
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
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Email..." {...field} />
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
						<Button type="submit" className="w-full justify-center" loading={status === 'loading'}>
							Submit
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<span>I don`t have an account!</span>
				&nbsp;
				<Link href="/auth/signup" className="font-bold">
					Sign Up!
				</Link>
			</CardFooter>
		</Card>
	);
};

export default SignIn;

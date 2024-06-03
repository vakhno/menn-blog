'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';

import SignIn from '@/components/shared/SignIn/SignIn';
import SignUp from '@/components/shared/SignUp/SignUp';

const page = () => {
	const { tab } = useParams<{ tab: string }>();
	const router = useRouter();
	const defaultTab =
		(tab && tab[0]) === 'signin' ? tab[0] : (tab && tab[0]) === 'signup' ? tab[0] : 'signin';

	const handleTabChange = (activeTab: string) => {
		router.push(`/auth/${activeTab}`);
	};

	return (
		<Tabs onValueChange={handleTabChange} defaultValue={defaultTab} className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="signin">Sign In</TabsTrigger>
				<TabsTrigger value="signup">Sign Up</TabsTrigger>
			</TabsList>
			<TabsContent value="signin">
				<SignIn />
			</TabsContent>
			<TabsContent value="signup">
				<SignUp />
			</TabsContent>
		</Tabs>
	);
};

export default page;

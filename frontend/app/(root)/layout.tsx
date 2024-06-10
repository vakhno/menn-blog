'use client';
import Header from '@/components/shared/Header/Header';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { isUserAuthorized } from '@/lib/redux/slices/authSlice';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	const dispatch = useAppDispatch();
	// const user = await axios.get('http://localhost:5555/auth/profile');
	// console.log('user', user);
	useLayoutEffect(() => {
		(async () => {
			dispatch(isUserAuthorized());
		})();
	});

	return (
		<div className="w-full">
			<Header />
			<div className="max-w-[920px] m-auto p-4">{children}</div>
		</div>
	);
};

export default layout;

'use client';
import Header from '@/components/shared/Header/Header';
import { useLayoutEffect, Suspense } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { isUserAuthorized } from '@/lib/redux/slices/authSlice';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	const dispatch = useAppDispatch();
	useLayoutEffect(() => {
		(async () => {
			dispatch(isUserAuthorized());
		})();
	});

	return (
		<div className="w-full">
			<Header />
			<Suspense>
				<div className="max-w-[920px] m-auto p-4">{children}</div>
			</Suspense>
		</div>
	);
};

export default layout;

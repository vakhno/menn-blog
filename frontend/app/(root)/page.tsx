'use client';
import React, { useEffect } from 'react';
import PostList from '@/components/shared/PostList/PostList';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useAuthorized } from '@/hooks/useAuthorized';
import { getPosts, setPage } from '@/lib/redux/slices/postSlice';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
type Props = {};

const page = (props: Props) => {
	useAuthorized();

	const dispatch = useAppDispatch();
	const { page } = useAppSelector((state) => state.post.posts);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const page = searchParams.get('page');
		dispatch(setPage({ page }));
		dispatch(getPosts());
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		router.push(`${pathname}?${params.toString()}`);
	}, [page]);

	return (
		<section>
			<PostList />
		</section>
	);
};

export default page;

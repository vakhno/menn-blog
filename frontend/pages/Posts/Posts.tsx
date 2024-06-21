'use server';
import React from 'react';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getPosts } from '@/actions/posts';
import PostList from '@/components/shared/PostList/PostList';

const Posts = async () => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['posts'],
		queryFn: getPosts,
	});

	return (
		<section>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<PostList />
			</HydrationBoundary>
		</section>
	);
};

export default Posts;

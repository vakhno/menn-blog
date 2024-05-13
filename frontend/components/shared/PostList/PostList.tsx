'use client';
import React from 'react';
import Post from '@/components/shared/Post/Post';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/lib/redux/slices/postSlice';
import { commentsCount } from '@/utils/comments';

const PostList = () => {
	const dispatch = useAppDispatch();
	const { data, status, page, isAllUploaded } = useAppSelector((state) => state.post.posts);
	useEffect(() => {
		if (status === 'error') {
		}
	}, [status]);

	const handleLoadMoreClick = () => {
		dispatch(getPosts({ page: Number(page) + 1 }));
	};

	return (
		<div>
			{data &&
				data.map((post) => (
					<Post
						key={post._id}
						id={post._id}
						classNames={'[&:not(:last-child)]:mb-4'}
						title={post.title}
						description={post.description}
						image={post.image}
						createdAt={post.createdAt}
						tags={post.tags}
						viewsCount={post.viewsCount}
						author={post.author}
						likesCount={post.likes}
						commentsCount={commentsCount(post.comments)}
					/>
				))}
			{status === 'loaded' ? (
				<>
					{isAllUploaded ? null : (
						<Button className="flex m-auto" onClick={handleLoadMoreClick}>
							Load more
						</Button>
					)}
				</>
			) : (
				Array.apply(null, new Array(5)).map((_, index) => {
					return (
						<div className="flex flex-col space-y-3" key={index}>
							<Skeleton className="w-full h-full h-[400px] rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default PostList;

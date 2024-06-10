'use client';
import React from 'react';
import Post from '@/components/shared/Post/Post';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { getPosts, setPosts } from '@/lib/redux/slices/postSlice';
import { commentsCount } from '@/utils/comments';
import { postType } from '@/types/types';

type Props = {
	posts: postType[];
	isAllPostsUploaded: boolean;
};

const PostList = ({ posts, isAllPostsUploaded }: Props) => {
	const dispatch = useAppDispatch();
	const { data, status, page, isAllUploaded } = useAppSelector((state) => state.post.posts);

	console.log(posts);
	useEffect(() => {
		dispatch(setPosts({ posts, isAllPostsUploaded }));
	}, [posts]);

	const handleLoadMoreClick = () => {
		dispatch(getPosts({ page: Number(page) + 1 }));
	};

	return (
		<>
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
			) : null}
		</>
	);
};

export default PostList;

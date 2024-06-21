'use client';
import { Suspense } from 'react';
// components
import Post from '@/components/shared/Post/Post';
import SomethingWentWrong from '@/components/shared/SomethingWentWrong/SomethingWentWrong';
// utils
import { commentsCount } from '@/utils/comments';
// actions
import { getPosts } from '@/actions/posts';
// react-query
import { useQuery } from '@tanstack/react-query';
// skeletons
import PostListSkeleton from '@/components/skeletons/PostListSkeleton';

const PostList = () => {
	try {
		const { data } = useQuery({
			queryFn: getPosts,
			queryKey: ['posts'],
		});

		const { success } = data;

		if (!success) {
			throw new Error();
		}

		const { posts } = data;

		return (
			<>
				<Suspense fallback={<PostListSkeleton />}>
					{posts &&
						posts.map((post) => (
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
				</Suspense>
			</>
		);
	} catch (error) {
		return <SomethingWentWrong />;
	}
};

export default PostList;

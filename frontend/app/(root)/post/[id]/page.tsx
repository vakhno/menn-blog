'use server';
import React from 'react';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/js/plugins.pkgd.min.js';
import FullPost from '@/components/shared/FullPost/FullPost';
import { commentsCount } from '@/utils/comments';
import { Suspense } from 'react';
import PostSkeleton from '@/components/skeletons/PostSkeleton';
import SomethingWentWrong from '@/components/shared/SomethingWentWrong/SomethingWentWrong';
import { postType } from '@/types/types';

const getPost = async (
	id: string,
): Promise<{ success: true; post: postType } | { success: false }> => {
	const response = await fetch('http://localhost:5555/post/post-by-id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
		},
		cache: 'no-store',
		body: JSON.stringify({ id }),
	});

	if (!response.ok) {
		throw new Error();
	}

	return response.json();
};

type Props = {
	params: { id: string };
};

const page = async ({ params }: Props) => {
	try {
		const id = params['id'];
		const result = await getPost(id);
		const { success } = result;
		if (!success) {
			throw new Error();
		}
		const { post } = result;
		return (
			<Suspense fallback={<PostSkeleton />}>
				<FullPost
					id={post._id}
					title={post.title}
					description={post.description}
					text={post.text}
					image={post.image}
					tags={post.tags}
					author={post.author}
					likesCount={post.likes}
					comments={post.comments}
					commentsCount={commentsCount(post.comments)}
				/>
			</Suspense>
		);
	} catch (error) {
		return <SomethingWentWrong />;
	}
};

export default page;

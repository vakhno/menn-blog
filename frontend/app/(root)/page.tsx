export const dynamic = 'auto';

import { Suspense } from 'react';
import PostList from '@/components/shared/PostList/PostList';
import PostListSkeleton from '@/components/skeletons/PostListSkeleton';
import SomethingWentWrong from '@/components/shared/SomethingWentWrong/SomethingWentWrong';

const getPosts = async (page: string) => {
	// for cache
	const response = await fetch('http://localhost:5555/post/post-by-page', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// 'Cache-Control': 'no-store',
		},
		body: JSON.stringify({ page }),
		// for cache
		// cache: 'no-store',
		// next: { revalidate: 60 },
	});
	console.log(response);
	if (!response.ok) {
		throw new Error();
	}

	return response.json();
};

type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: Props) => {
	try {
		const page = searchParams['page'] as string;
		const result = await getPosts(page);
		const { success, isAllUploaded, posts } = result;

		if (!success) {
			throw new Error();
		}

		return (
			<section>
				<Suspense fallback={<PostListSkeleton />}>
					<PostList posts={posts} isAllPostsUploaded={isAllUploaded} />
				</Suspense>
			</section>
		);
	} catch (error) {
		return (
			<section>
				<SomethingWentWrong />
			</section>
		);
	}
};

export default Page;

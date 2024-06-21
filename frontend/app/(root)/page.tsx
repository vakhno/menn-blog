'use server';
import { Suspense } from 'react';
// page component
import Posts from '@/pages/Posts/Posts';
import PostListSkeleton from '@/components/skeletons/PostListSkeleton';

const Page = () => {
	return (
		// this Suspense will be shown while posts is caching (first caching)
		// and also before uploading cached posts and to cancel displaying
		// Suspense before uploading cached posts inside </Posts> jsx should we wrapped
		// with empty Suspense
		<Suspense fallback={<PostListSkeleton />}>
			<Posts />
		</Suspense>
	);
};

export default Page;

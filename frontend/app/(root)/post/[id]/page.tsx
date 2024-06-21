'use server';
import React from 'react';
import { Suspense } from 'react';
import PostSkeleton from '@/components/skeletons/PostSkeleton';
import PostById from '@/pages/PostById/PostById';

type Props = {
	params: { id: string };
};

const page = ({ params }: Props) => {
	const id = params['id'];

	return (
		<Suspense fallback={<PostSkeleton />}>
			<PostById id={id} />
		</Suspense>
	);
};

export default page;

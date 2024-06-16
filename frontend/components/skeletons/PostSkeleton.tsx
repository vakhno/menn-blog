import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PostSkeleton = () => {
	return (
		<div className="flex flex-col space-y-3 gap-4 mb-8">
			<div className="flex flex-col gap-2">
				<Skeleton className="w-full h-8 w-40 rounded-lg" />
				<Skeleton className="w-full h-10 rounded-lg" />
			</div>
			<Skeleton className="w-full h-[600px] rounded-xl" />
			<Skeleton className="w-full h-10 rounded-lg" />
		</div>
	);
};

export default PostSkeleton;

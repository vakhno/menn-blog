import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PostListSkeleton = () => {
	return Array(5)
		.fill('')
		.map((_, index) => {
			return (
				<div className="flex flex-col space-y-3 gap-4 mb-8" key={index}>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Skeleton className="w-full h-20 w-20 rounded-full" />
							<Skeleton className="w-full h-8 w-40 rounded-lg" />
						</div>
						<Skeleton className="w-full h-10 rounded-lg" />
					</div>
					<Skeleton className="w-full h-[600px] rounded-xl" />
					<Skeleton className="w-full h-10 rounded-lg" />
				</div>
			);
		});
};

export default PostListSkeleton;

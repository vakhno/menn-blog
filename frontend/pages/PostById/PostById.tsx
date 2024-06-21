'use server';
import FullPost from '@/components/shared/FullPost/FullPost';
import { getPostById } from '@/actions/posts';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';

type Props = {
	id: string;
};

const PostById = async ({ id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['postById'],
		queryFn: () => getPostById(id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<FullPost id={id} />
		</HydrationBoundary>
	);
};

export default PostById;

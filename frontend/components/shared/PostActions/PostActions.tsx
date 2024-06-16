import React from 'react';
// icons
import { HiPencilAlt } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
// next tools
import Link from 'next/link';
// UI components
import { Button } from '@/components/ui/button';
// page components
import LikePostButton from '@/components/shared/LikePostButton/LikePostButton';
// redux
import { deletePost } from '@/lib/redux/slices/postSlice';
// redux hooks
import { useAppDispatch } from '@/lib/redux/hooks';

type Props = { postId: string; userId: string | null; authorId: string | null };

const PostActions = ({ postId, userId, authorId }: Props) => {
	const dispatch = useAppDispatch();

	const handleDeleteClick = () => {
		dispatch(deletePost({ postId: postId }));
	};

	return (
		<div className="flex gap-2 justify-end mb-6">
			{userId === authorId ? (
				<>
					<Link href={`/post/${postId}/edit`}>
						<Button variant="outline" size="icon">
							<HiPencilAlt />
						</Button>
					</Link>

					<Button variant="outline" size="icon" onClick={handleDeleteClick}>
						<HiTrash />
					</Button>
				</>
			) : null}
			<LikePostButton postId={postId} userId={userId} />
		</div>
	);
};

export default PostActions;

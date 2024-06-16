import React from 'react';
// components
import LikeButton from '@/components/shared/LikeButton/LikeButton';
// redux hooks
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
// redux
import { likeComment } from '@/lib/redux/slices/authSlice';
// next tools
import { useRouter } from 'next/navigation';

type Props = {
	userId: string | null;
	commentId: string | null;
};

const LikeCommentButton = ({ userId, commentId }: Props) => {
	const { toast } = useToast();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const likedComments = useAppSelector((state) => state.auth.user?.likedComments) || [];

	const handleLikeClick = () => {
		if (commentId && userId) {
			dispatch(likeComment({ commentId: commentId, userId }));
		} else {
			toast({
				title: 'Error',
				description: `To like you should Sign In`,
				variant: 'destructive',
				action: (
					<ToastAction altText="Sign In" onClick={() => router.push('/auth/signin')}>
						Sign In
					</ToastAction>
				),
			});
		}
	};

	const isCommentLiked = () => {
		return likedComments.some((likedComment) => likedComment === commentId);
	};

	return <LikeButton handleLikeClick={handleLikeClick} isLiked={isCommentLiked()} />;
};

export default LikeCommentButton;

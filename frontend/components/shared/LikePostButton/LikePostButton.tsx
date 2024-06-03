import React from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUserLikes } from '@/lib/redux/slices/authSlice';
import { updatePostLikes } from '@/lib/redux/slices/postSlice';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import LikeButton from '@/components/shared/LikeButton/LikeButton';

interface Props {
	postId: string | null;
	userId: string | null;
}

const LikePostButton = ({ postId, userId }: Props) => {
	const { toast } = useToast();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const likedPosts = useAppSelector((state) => state?.auth?.user?.likedPosts || []);

	const isPostLiked = () => {
		return likedPosts.some((likedPost: string) => likedPost === postId);
	};

	const handleLikeClick = () => {
		if (postId && userId) {
			dispatch(updatePostLikes({ postId, isAlreadyLiked: isPostLiked() }));
			dispatch(updateUserLikes({ postId, userId }));
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

	return <LikeButton handleLikeClick={handleLikeClick} isLiked={isPostLiked()} />;
};

export default LikePostButton;

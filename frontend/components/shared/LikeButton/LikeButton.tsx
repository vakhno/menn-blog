import React from 'react';
// icons
import { HiHeart } from 'react-icons/hi';
// UI components
import { Button } from '@/components/ui/button';
// utils
import { cn } from '@/lib/utils';

type Props = { handleLikeClick: () => void; isLiked: boolean };

const LikeButton = ({ handleLikeClick, isLiked }: Props) => {
	return (
		<Button
			variant="outline"
			size="icon"
			onClick={handleLikeClick}
			className={cn({ 'bg-red-600 hover:bg-red-800': isLiked })}>
			<HiHeart />
		</Button>
	);
};

export default LikeButton;

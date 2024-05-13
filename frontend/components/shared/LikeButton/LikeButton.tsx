import React from 'react';
import { HiHeart } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

type Props = { handleLikeClick: () => void; isLiked: boolean };

const LikeButton = ({ handleLikeClick, isLiked }: Props) => {
	return (
		<Button
			variant="outline"
			size="icon"
			onClick={handleLikeClick}
			className={`${isLiked ? 'bg-red-600 hover:bg-red-800' : ''}`}>
			<HiHeart />
		</Button>
	);
};

export default LikeButton;

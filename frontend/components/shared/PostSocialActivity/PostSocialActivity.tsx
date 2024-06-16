import React from 'react';
// icons
import { HiChatAlt } from 'react-icons/hi';
import { HiHeart } from 'react-icons/hi';

type Props = {
	likesCount: number;
	commentsCount: number;
};

const PostSocialActivity = ({ likesCount = 0, commentsCount = 0 }: Props) => {
	return (
		<ul className="flex">
			<li className="mr-2 flex items-center">
				<HiHeart className="mr-1" />
				<span>{likesCount}</span>
			</li>
			<li className="flex items-center">
				<HiChatAlt className="mr-1" />
				<span>{commentsCount}</span>
			</li>
		</ul>
	);
};

export default PostSocialActivity;

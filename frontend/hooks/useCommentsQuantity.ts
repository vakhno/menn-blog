import { commentType } from '@/types/types';

export const useCommentsQuantity = () => {
	let commentsAmount = 0;

	const calculateCommentsAmount = (comments: commentType[]) => {
		if (Array.isArray(comments)) {
			commentsAmount += comments.length;
			comments.forEach((comment) => {
				if (comment.replies) {
					calculateCommentsAmount(comment.replies);
				}
			});
		} else {
			commentsAmount = 0;
		}
	};

	const useCommentsAmount = (comments: commentType[]) => {
		commentsAmount = 0;
		calculateCommentsAmount(comments);
	};

	return { commentsAmount, useCommentsAmount };
};

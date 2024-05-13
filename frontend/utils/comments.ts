import { commentType } from '@/types/types';

export const commentsCount = (postComments: commentType[]) => {
	let commentsCount = 0;
	commentsCount += postComments.length;
	const calculatingRepliesCount = (comments: commentType[]) => {
		for (const comment of comments) {
			commentsCount += comment.replies.length;
			if (comment.replies) {
				calculatingRepliesCount(comment.replies);
			}
		}
	};
	calculatingRepliesCount(postComments);
	return commentsCount;
};

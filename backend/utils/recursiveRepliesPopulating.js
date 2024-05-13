// models
import PostModel from '../models/Post.model.js';

export const recursiveRepliesPopulating = async (comments) => {
	for (const comment of comments) {
		if (comment.replies && comment.replies.length > 0) {
			await PostModel.populate(comment, { path: 'replies', populate: { path: 'author' } });
			await recursiveRepliesPopulating(comment.replies);
		}
	}
};

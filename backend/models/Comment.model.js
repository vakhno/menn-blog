// libraries
import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: true,
		},
		likes: {
			type: Number,
			default: 0,
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model('Comment', CommentSchema);

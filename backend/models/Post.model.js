// libraries
import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			reqiored: true,
		},
		image: {
			type: String,
		},
		likes: {
			type: Number,
			default: 0,
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
	},
	{ timestamps: true },
);

export default mongoose.model('Post', PostSchema);

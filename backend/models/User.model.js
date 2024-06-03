// libraries
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: function () {
				return !this.isSocial;
			},
			select: false,
		},
		isSocial: {
			type: Boolean,
			required: true,
			default: false,
		},
		avatar: {
			type: String,
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		likedPosts: [{ type: String }],
		likedComments: [{ type: String }],
	},
	{ timestamps: true },
);

export default mongoose.model('User', UserSchema);

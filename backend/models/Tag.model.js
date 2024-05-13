// libraries
import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
	value: {
		type: String,
		required: true,
		unique: true,
	},
	label: {
		type: String,
		required: true,
	},
	popularity: {
		type: Number,
		default: 0,
	},
});

export default mongoose.model('Tag', TagSchema);

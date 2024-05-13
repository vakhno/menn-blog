// models
import TagModel from '../models/Tag.model.js';
// default values
import DefaultTags from '../default/tag.default.js';

export const postDefaultTags = async (_, res) => {
	try {
		const tags = await TagModel.find();
		if (tags.length) {
			return res.status(200).json({ success: true });
		} else {
			if (Array.isArray(DefaultTags) && DefaultTags.length) {
				await TagModel.insertMany(DefaultTags);

				return res.status(200).json({ success: true });
			} else {
				return res.status(500).json({ success: false });
			}
		}
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const getTags = async (_, res) => {
	try {
		const tags = await TagModel.find();
		return res.status(200).json({ success: true, tags });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

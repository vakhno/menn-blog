// models
import PostModel from '../models/Post.model.js';
import CommentModel from '../models/Comment.model.js';
import UserModel from '../models/User.model.js';
// utils
import { recursiveRepliesPopulating } from '../utils/recursiveRepliesPopulating.js';

export const createPost = async (req, res) => {
	try {
		const fields = req.body;
		const { author } = fields;
		const newPost = new PostModel({ ...fields });
		const savedPost = await newPost.save();
		const { _id } = savedPost._doc;
		// adding created Post _id to the list of user posts
		await UserModel.findByIdAndUpdate(author, { $push: { posts: _id } });
		return res.status(200).json({ success: true, data: savedPost });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { postId } = req.body;
		const post = await PostModel.findById(postId);
		const { author } = post;
		// removing Post _id from the user post list
		await UserModel.findByIdAndUpdate(author, { $pull: { posts: postId } });
		// removing post comments
		await CommentModel.deleteMany({ _id: { $in: post.comments } });
		// removing post
		await PostModel.deleteOne({ _id: postId });
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const editPost = async (req, res) => {
	try {
		const { fields, postId } = req.body;
		await PostModel.findByIdAndUpdate(postId, fields);
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const getPosts = async (req, res) => {
	console.log('111');
	try {
		// quantity of posts
		const limit = 10;
		let { page } = req.body;
		// checking if page is number
		page = isFinite(page) ? +page : 1;
		const posts = await PostModel.find()
			.limit(limit * page)
			.sort({ createdAt: -1 })
			.populate('author')
			.populate('tags')
			.populate('comments')
			.populate({
				path: 'comments',
				populate: { path: 'author' },
			});
		for (const post of posts) {
			await recursiveRepliesPopulating(post.comments);
		}
		const totalPostsCount = await PostModel.countDocuments();
		const isAllPostsUploaded = posts.length === totalPostsCount;
		return res.status(200).json({ success: true, isAllUploaded: isAllPostsUploaded, posts });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error, success: false });
	}
};

export const getPostById = async (req, res) => {
	try {
		const { id } = req.body;
		const post = await PostModel.findById(id)
			.populate('author')
			.populate('tags')
			.populate({
				path: 'comments',
				populate: { path: 'author' },
			});
		await recursiveRepliesPopulating(post.comments);
		return res.status(200).json({ success: true, post });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const imageUpload = async (req, res) => {
	try {
		const { filename } = req.file;
		const { id } = req.body;
		const post = await PostModel.findById(id);
		post.image = filename;
		await post.save();
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const sendComment = async (req, res) => {
	try {
		const { comment, userId, postId, parentId } = req.body;
		const post = await PostModel.findById(postId);
		if (post) {
			const preparedComment = {
				author: userId,
				post: postId,
				text: comment,
			};
			// if parentId is provided it means this is a reply
			if (parentId) {
				const parentComment = await CommentModel.findById(parentId);
				if (parentComment) {
					const newReply = new CommentModel(preparedComment);
					await newReply.save();
					parentComment.replies = [...parentComment.replies, newReply._id];
					await parentComment.save();
					await (await newReply.populate('author')).populate('post');
					return res.status(200).json({ success: true, comment: newReply });
				}
			} else {
				const newComment = new CommentModel(preparedComment);
				if (newComment) {
					const savedComment = await newComment.save();
					post.comments = [...post.comments, savedComment];
					await post.save();
					await (await savedComment.populate('author')).populate('post');
					return res
						.status(200)
						.json({ success: true, comments: post.comments, comment: savedComment });
				} else {
					return res.status(500).json({ success: false });
				}
			}
		} else {
			return res.status(500).json({ success: false });
		}
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const likePost = async (req, res) => {
	try {
		const { postId, userId } = req.body;
		const user = await UserModel.findById(userId);
		const isAlreadyLiked = user.likedPosts.some((likedPost) => likedPost === postId);
		if (isAlreadyLiked) {
			user.likedPosts = user.likedPosts.filter((likedPost) => likedPost !== postId);
			await PostModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
		} else {
			user.likedPosts = [...user.likedPosts, postId];
			await PostModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
		}
		await user.save();
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const likeComment = async (req, res) => {
	try {
		const { commentId, userId } = req.body;
		const user = await UserModel.findById(userId);
		const isAlreadyLiked = user.likedComments.some((likedComment) => likedComment === commentId);
		if (isAlreadyLiked) {
			user.likedComments = user.likedComments.filter((likedComment) => likedComment !== commentId);
		} else {
			user.likedComments = [...user.likedComments, commentId];
		}
		await user.save();
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

// libraries
import express from 'express';
// controllers
import {
	createPost,
	deletePost,
	getPosts,
	getPostById,
	imageUpload,
	sendComment,
	likeComment,
	likePost,
	editPost,
} from '../controllers/post.controller.js';
// utils
import tokenCheck from '../utils/tokenCheck.js';
import multerImageUpload from '../utils/multerImageUpload.js';

const router = express.Router();

router.post('/post', tokenCheck, createPost);
router.post('/post-by-id', getPostById);
router.post('/post-by-page', getPosts);
router.post('/image-upload', multerImageUpload, imageUpload);
router.post('/send-comment', sendComment);
router.post('/like-comment', likeComment);
router.post('/like-post', likePost);
router.delete('/delete-post', deletePost);
router.post('/edit-post', editPost);

export default router;

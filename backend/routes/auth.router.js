// libraries
import express from 'express';
// controllers
import {
	SignIn,
	SignUp,
	LogOut,
	GetProfile,
	avatarUpload,
} from '../controllers/auth.controller.js';
// utils
import tokenCheck from '../utils/tokenCheck.js';
import multerAvatarUpload from '../utils/multerAvatarUpload.js';

const router = express.Router();

router.post('/signin', SignIn);
router.post('/signup', SignUp);
router.get('/profile', GetProfile);
router.post('/avatar-upload', multerAvatarUpload, avatarUpload);
router.post('/logout', tokenCheck, LogOut);

export default router;

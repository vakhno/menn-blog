// libraries
import express from 'express';
// controllers
import {
	SignIn,
	SignUp,
	LogOut,
	GetProfile,
	avatarUpload,
	Google,
	GoogleCallback,
} from '../controllers/auth.controller.js';
// utils
import tokenCheck from '../utils/tokenCheck.js';
import multerAvatarUpload from '../utils/multerAvatarUpload.js';

const router = express.Router();

router.post('/signin', SignIn);
router.post('/signup', SignUp);
router.get('/google', Google);
router.get('/profile', GetProfile);
router.post('/avatar-upload', multerAvatarUpload, avatarUpload);
router.get('/google/callback', GoogleCallback);
router.post('/logout', tokenCheck, LogOut);

export default router;

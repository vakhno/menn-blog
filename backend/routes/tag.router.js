// libraries
import express from 'express';
// controllers
import { getTags, postDefaultTags } from '../controllers/tag.controller.js';
// utils
import tokenCheck from '../utils/tokenCheck.js';

const router = express.Router();

router.post('/tag', postDefaultTags);
router.get('/tag', tokenCheck, getTags);

export default router;

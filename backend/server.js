// libraries
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// DB
import connectToDb from './db/connectToDb.js';
// routes
import authRouter from './routes/auth.router.js';
import tagRouter from './routes/tag.router.js';
import postRouter from './routes/post.router.js';

const PORT = process.env.PORT || 5555;

const options = {
	credentials: true,
	origin: true,
};

dotenv.config();

const app = express();

// app for libraries
app.use(express.json());
app.use(cors(options));
app.use(cookieParser());
// app for routes
app.use('/auth', authRouter);
app.use('/tag', tagRouter);
app.use('/post', postRouter);
// app for folders
app.use('/uploads', express.static('uploads'));

app.listen(PORT, (error) => {
	if (error) {
		console.log(error);
		return;
	} else {
		connectToDb();
	}
});

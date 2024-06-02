// models
import UserModel from '../models/User.model.js';
// libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export const SignIn = async (req, res) => {
	try {
		const { password, email } = req.body;
		const foundUser = await UserModel.findOne({ email }).select('+password');
		if (foundUser) {
			const { password: userPassword, ...user } = foundUser._doc;
			const token = jwt.sign(
				{
					_id: user._id,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '15d',
				},
			);
			const isPasswordValid = await bcrypt.compare(password, userPassword);
			if (isPasswordValid) {
				// httpOnly for server side access only
				res.cookie('token', token, { HttpOnly: true, secure: false });

				return res.status(200).json({ success: true, user });
			} else {
				return res.status(404).json({ success: false });
			}
		} else {
			return res.status(400).json({ sucess: false });
		}
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const SignUp = async (req, res) => {
	try {
		const { password, name, email, avatar } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new UserModel({
			name,
			password: hashedPassword,
			email,
			avatar,
		});
		try {
			const savedUser = await newUser.save();
			const { password, ...user } = savedUser._doc;
			// to generate JWT_SECRET was used this command: openssl rand -base64 32
			const token = jwt.sign(
				{
					_id: user._id,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '15d',
				},
			);
			// set cookie (httpOnly for server side access only)
			res.cookie('token', token, { HttpOnly: true, secure: false });
			return res.status(200).json({ user, token, success: true });
		} catch (error) {
			return res.status(409).json({ error, success: false });
		}
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const LogOut = (_, res) => {
	try {
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const GetProfile = async (req, res) => {
	try {
		const token = req.cookies?.token;
		if (token) {
			const { _id } = jwt.verify(token, process.env.JWT_SECRET);
			const { _doc: user } = await UserModel.findById(_id);
			return res.status(200).json({ success: true, user });
		} else {
			return res.status(200).json({ success: false });
		}
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

export const avatarUpload = async (req, res) => {
	try {
		const { filename } = req.file;
		const { id } = req.body;
		const user = await UserModel.findById(id);
		user.avatar = filename;
		await user.save();
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error, success: false });
	}
};

// const googleClient = new OAuth2Client({
// 	clientId: `${process.env.AUTH_GOOGLE_ID}`,
// 	clientSecret: `${process.env.AUTH_GOOGLE_SECRET}`,
// });

// export const Google = async (req, res) => {
// 	const { token } = req.body;
// 	console.log(token);
// 	const ticket = await googleClient.verifyIdToken({
// 		idToken: token,
// 		audient: `${process.env.AUTH_GOOGLE_ID}`,
// 	});

// 	const payload = ticket.getPayload();
// 	console.log('PAYLOAD', payload);
// 	// let user = await User.findOne({ email: payload?.email });
// 	// if (!user) {
// 	//   user = await new User({
// 	// 	email: payload?.email,
// 	// 	avatar: payload?.picture,
// 	// 	name: payload?.name,
// 	//   });

// 	//   await user.save();
// 	// }

// 	res.json({ user, token });
// };

export const Google = (req, res) => {
	const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&redirect_uri=${process.env.AUTH_REDIRECT_URI}&response_type=code&scope=profile email`;
	return res.status(200).json({ url, success: true });
};

export const GoogleCallback = async (req, res) => {
	try {
		const { code } = req.query;
		// Exchange authorization code for access token
		const { data } = await axios.post('https://oauth2.googleapis.com/token', {
			client_id: process.env.AUTH_GOOGLE_ID,
			client_secret: process.env.AUTH_GOOGLE_SECRET,
			code,
			redirect_uri: process.env.AUTH_REDIRECT_URI,
			grant_type: 'authorization_code',
		});
		const { access_token } = data;

		// Use access_token or id_token to fetch user profile
		// prompt=consent param to immediate redirection
		const { data: googleUser } = await axios.get(
			'https://www.googleapis.com/oauth2/v1/userinfo?prompt=consent',
			{
				headers: { Authorization: `Bearer ${access_token}` },
			},
		);
		const { email, name, picture } = googleUser;
		const existingUser = await UserModel.findOne({ email });
		let user = {};
		if (existingUser) {
			user = existingUser;
		} else {
			const newUser = new UserModel({
				email,
				name,
				isSocial: true,
				avatar: picture,
			});
			await newUser.save();
			user = newUser;
		}
		console.log('USER', user);
		// const token = jwt.sign(
		// 	{
		// 		_id: user._id,
		// 	},
		// 	process.env.JWT_SECRET,
		// 	{
		// 		expiresIn: '1m',
		// 	},
		// );
		// res.cookie('token', token, { HttpOnly: true, secure: false });
		JWTimplementing(user._id, res);
		res.redirect(process.env.AUTH_SUCCESS_REDIRECT);
	} catch (error) {
		res.redirect('http://localhost:3000/auth/signin');
		return res.status(500).json({ error, success: false });
	}
};

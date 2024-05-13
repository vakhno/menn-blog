// models
import UserModel from '../models/User.model.js';
// libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

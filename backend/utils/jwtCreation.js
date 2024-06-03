import jwt from 'jsonwebtoken';

export const JWTCreation = (id, res) => {
	// to generate JWT_SECRET was used this command: openssl rand -base64 32
	const token = jwt.sign(
		{
			_id: id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '1',
		},
	);
	// httpOnly for server side access only
	res.cookie('token', token, { HttpOnly: true, secure: false });
};

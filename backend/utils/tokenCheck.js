// libraries
import jwt from 'jsonwebtoken';

const tokenCheck = (req, res, next) => {
	const token = req.cookies?.token;
	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.userId = decoded._id;
			// call next middleware or route handler
			next();
		} catch (error) {
			return res.status(403).json({ success: false, error });
		}
	} else {
		return res.status(400).json({ success: false });
	}
};

export default tokenCheck;

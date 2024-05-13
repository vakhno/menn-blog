// libraries
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const multerAvatarUpload = (req, res, next) => {
	try {
		// initialize root directory
		const __dirname = path.resolve();
		// path for users avatar folder
		const uploadFolder = path.join(__dirname, 'uploads', 'users');
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				// create folder if it does not exist
				if (!fs.existsSync(uploadFolder)) {
					fs.mkdirSync(uploadFolder);
				}
				cb(null, uploadFolder);
			},
			filename: function (req, file, cb) {
				let filename = req.body.id + path.extname(file.originalname);
				cb(null, filename);
			},
		});
		const upload = multer({ storage: storage });
		// apply multer middleware for a single file upload
		upload.single('avatar')(req, res, function (error) {
			if (error) {
				return res.status(500).json({ success: false, error });
			}
			// call next middleware or route handler
			next();
		});
	} catch (error) {
		return res.status(500).json({ success: false, error });
	}
};

export default multerAvatarUpload;

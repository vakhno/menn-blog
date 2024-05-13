// libraries
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const multerImageUpload = (req, res, next) => {
	try {
		// initialize root directory
		const __dirname = path.resolve();
		// path for post images folder
		const uploadFolder = path.join(__dirname, 'uploads', 'posts');
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				// create folder if it does not exist
				if (!fs.existsSync(uploadFolder)) {
					fs.mkdirSync(uploadFolder);
				}
				cb(null, uploadFolder);
			},
			filename: function (req, file, cb) {
				const fileList = fs.readdirSync(uploadFolder);
				const alreadyExistFile = fileList.find((file) => file.startsWith(req.body.id));
				if (alreadyExistFile) {
					// removing already exist file, because replacing wouldn't work if files have different extensions (png and jpg e.g.)
					fs.unlinkSync(`${uploadFolder}\\${alreadyExistFile}`);
				}
				let filename = req.body.id + path.extname(file.originalname);
				cb(null, filename);
			},
		});
		const upload = multer({ storage: storage });
		// apply multer middleware for a single file upload
		upload.single('image')(req, res, function (error) {
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

export default multerImageUpload;

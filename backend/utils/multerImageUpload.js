// libraries
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const multerImageUpload = (req, res, next) => {
	try {
		// initialize root directory
		const __dirname = path.resolve();
		// path for post images folder
		const uploadsFolder = path.join(__dirname, 'uploads');
		const postsFolder = path.join(uploadsFolder, 'posts');
		// checking if 'uploads' folder exist
		if (!fs.existsSync(uploadsFolder)) {
			fs.mkdirSync(uploadsFolder);
		}
		// checking if 'posts' folder exist
		if (!fs.existsSync(postsFolder)) {
			fs.mkdirSync(postsFolder);
		}

		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, postsFolder);
			},
			filename: function (req, file, cb) {
				const fileList = fs.readdirSync(postsFolder);
				const alreadyExistFile = fileList.find((file) => file.startsWith(req.body.id));
				if (alreadyExistFile) {
					// removing already exist file, because replacing wouldn't work if files have different extensions (png and jpg e.g.)
					fs.unlinkSync(`${postsFolder}\\${alreadyExistFile}`);
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

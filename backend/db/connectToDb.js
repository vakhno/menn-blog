// libraries
import mongoose from 'mongoose';
import axios from 'axios';

const connectToDb = () => {
	mongoose
		.connect(process.env.MONGO_DB_URI)
		.then(() => {
			console.log('Success connection to DB!');
			axios.post('http://localhost:5555/tag/tag');
		})
		.catch((error) => console.log(error));
};

export default connectToDb;

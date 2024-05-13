import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import tagSlice from './slices/tagSlice';
import postSlice from './slices/postSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth: authSlice,
			tag: tagSlice,
			post: postSlice,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

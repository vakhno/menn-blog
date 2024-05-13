import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/lib/axios/axios';
import { tagType } from '@/types/types';

type tagsType = {
	tags: tagType[];
};

type initialStateType = {
	tags: tagType[];
	status: 'loaded' | 'loading' | 'error';
};

export const getTags = createAsyncThunk('tag/getTags', async () => {
	try {
		const result = await axios.get('/tag/tag', { withCredentials: true });
		const { tags }: tagsType = result.data;
		return { tags };
	} catch (error) {
		throw new Error();
	}
});

const initialState: initialStateType = {
	tags: [],
	status: 'loaded',
};

const tagSlice = createSlice({
	name: 'tag',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getTags.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getTags.fulfilled, (state, action: PayloadAction<tagsType>) => {
				const { tags } = action.payload;
				state.tags = tags;
				state.status = 'loaded';
			})
			.addCase(getTags.rejected, (state) => {
				state.status = 'error';
			});
	},
});

export const {} = tagSlice.actions;
export default tagSlice.reducer;

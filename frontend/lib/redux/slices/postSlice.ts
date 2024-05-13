import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/lib/axios/axios';
import { commentType, postType, tagType } from '@/types/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type initialStateType = {
	posts: {
		data: postType[];
		status: 'loaded' | 'loading' | 'error';
		page: number;
		isAllUploaded: boolean;
	};
	isCommentReplyFormActive: null | string;
	openedPost: null | postType;
	isEditable: boolean;
	status: 'loaded' | 'loading' | 'error';
};

type postPostType = {
	fields: {
		title: string;
		description: string;
		author: string;
		text: string;
		tags: tagType[];
	};
	image: null | File;
	router: AppRouterInstance;
};

type editPostType = {
	fields: {
		title: string;
		description: string;
		author: string | null;
		text: string;
		tags: tagType[];
	};
	image: null | File;
	postId: string;
	router: AppRouterInstance;
};

export const postPost = createAsyncThunk('post/postPost', async (params: postPostType) => {
	try {
		const { fields, image, router } = params;
		const result = await axios.post('/post/post', fields, { withCredentials: true });
		const { success, data } = result.data;
		if (success) {
			if (image) {
				const formData = new FormData();
				formData.append('id', data._id);
				formData.append('image', image);
				const result = await axios.post('/post/image-upload', formData, {
					withCredentials: true,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				});
				const { success } = result.data;
				if (success) {
					return { router };
				} else {
					throw new Error();
				}
			} else {
				return { router };
			}
		} else {
			throw new Error();
		}
	} catch (error) {
		throw new Error();
	}
});

export const editPost = createAsyncThunk('post/editPost', async (params: editPostType) => {
	const { fields, image, postId, router } = params;
	const result = await axios.post('/post/edit-post', { fields, postId }, { withCredentials: true });
	const { success } = result.data;
	if (success) {
		if (image) {
			const formData = new FormData();
			formData.append('id', postId);
			formData.append('image', image);
			const result = await axios.post('/post/image-upload', formData, {
				withCredentials: true,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			});
			const { success } = result.data;
			if (success) {
				return { router, postId };
			} else {
				throw new Error();
			}
		} else {
			return { router, postId };
		}
	} else {
		throw new Error();
	}
});

export const getPosts = createAsyncThunk(
	'post/getPosts',
	async (params: { page: number }, { getState }) => {
		return new Promise<{ posts: postType[]; page: number; isAllUploaded: boolean }>(
			(resolve, rejected) => {
				setTimeout(async () => {
					try {
						const { post } = getState() as { post: initialStateType };
						// if user clicked on 'Load More' or page param exist in URL
						const { page: currentPage } = post.posts;
						let availablePage = currentPage;
						if (params) {
							const { page: newPage } = params;
							availablePage = newPage;
						}
						// current page, before changes
						// if page wasnt passed then using default value
						const result = await axios.post('post/post-by-page', { page: availablePage });
						const { success, posts, isAllUploaded } = result.data;
						if (success) {
							resolve({ posts: posts, page: availablePage, isAllUploaded });
						} else {
							rejected();
						}
					} catch (error) {
						rejected();
					}
				}, 500);
			},
		);
	},
);

export const openPost = createAsyncThunk('post/openPost', async (params: { id: string }) => {
	try {
		const { id } = params;
		const result = await axios.post('/post/post-by-id', { id });
		const { success, post } = result.data;
		if (success) {
			return { post };
		} else {
			throw new Error();
		}
	} catch (error) {
		throw new Error();
	}
});

export const deletePost = createAsyncThunk(
	'post/deletePost',
	async (params: { postId: string }) => {
		try {
			const { postId } = params;
			const result = await axios.delete('/post/delete-post', { data: { postId } });
			const { success } = result.data;
			if (success) {
				return { postId };
			} else {
				throw new Error();
			}
		} catch (error) {
			throw new Error();
		}
	},
);

export const addCommentToPost = createAsyncThunk(
	'post/addCommentToPost',
	async (params: { parentId: string }) => {
		try {
			const { parentId } = params;
			const result = await axios.post('/post/send-comment', params);
			const { comment } = result.data;
			return { comment, parentId };
		} catch (error) {
			throw new Error();
		}
	},
);

const initialState: initialStateType = {
	posts: {
		data: [],
		status: 'loaded',
		page: 0,
		isAllUploaded: false,
	},
	isCommentReplyFormActive: null,
	openedPost: null,
	isEditable: false,
	status: 'loaded',
};

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		setPage: (state, action) => {
			const { page } = action.payload;
			if (typeof page === 'number' && page > 0) {
				state.posts.page = page;
			} else {
				state.posts.page = 1;
			}
		},
		setReplyForm: (state, action) => {
			const { id } = action.payload;

			state.isCommentReplyFormActive = id;
		},
		updatePostLikes: (state, action) => {
			const { postId, isAlreadyLiked } = action.payload;
			const likedPost = state.posts.data.find((post) => post._id === postId);
			if (likedPost) {
				if (isAlreadyLiked) {
					likedPost.likes -= 1;
				} else {
					likedPost.likes += 1;
				}
			}
			if (state.openedPost) {
				if (isAlreadyLiked) {
					if (state.openedPost) {
						state.openedPost.likes -= 1;
					}
				} else {
					if (state.openedPost) {
						state.openedPost.likes += 1;
					}
				}
			}
		},
	},
	extraReducers: (builder) => {
		builder
			// posting new post
			.addCase(postPost.pending, (state) => {})
			.addCase(
				postPost.fulfilled,
				(state, action: PayloadAction<{ router: AppRouterInstance } | undefined>) => {
					if (action.payload) {
						const { router } = action.payload;
						router.push('/');
					}
				},
			)
			.addCase(postPost.rejected, (state) => {})
			.addCase(openPost.pending, (state) => {
				state.status = 'loading';
			})
			// getting post list
			.addCase(getPosts.pending, (state) => {
				state.posts.status = 'loading';
			})
			.addCase(
				getPosts.fulfilled,
				(
					state,
					action: PayloadAction<
						{ posts: postType[]; page: number; isAllUploaded: boolean } | undefined
					>,
				) => {
					if (action.payload) {
						const { posts, page, isAllUploaded } = action.payload;
						state.posts.data = [...posts];
						state.posts.page = page;
						state.posts.isAllUploaded = isAllUploaded;
						state.posts.status = 'loaded';
					}
				},
			)
			.addCase(getPosts.rejected, (state) => {
				state.posts.status = 'error';
			})
			// opening post to full verison (with text)
			.addCase(
				openPost.fulfilled,
				(state: initialStateType, action: PayloadAction<{ post: postType }>) => {
					const { post } = action.payload;
					// const { comments, ...selectedPost } = post;
					state.openedPost = post;
					// state.comments = comments;
					state.status = 'loaded';
				},
			)
			.addCase(openPost.rejected, (state) => {
				state.status = 'error';
			})
			// adding comment/reply to post
			.addCase(addCommentToPost.pending, (state) => {})
			.addCase(addCommentToPost.fulfilled, (state, action) => {
				const replyImplementin = (
					comments: commentType[],
					createdComment: commentType,
					parentId: string,
				) => {
					for (const comment of comments) {
						if (comment._id === parentId) {
							comment.replies.push(createdComment);
							return comments;
						} else {
							if (comment.replies.length) {
								replyImplementin(comment.replies, createdComment, parentId);
							}
						}
					}
					state.isCommentReplyFormActive = null;
					return comments;
				};

				const { comment, parentId } = action.payload;
				const postComments = state.openedPost?.comments || [];
				let updatedComments = [];
				if (parentId) {
					updatedComments = replyImplementin([...postComments], comment, parentId);
				} else {
					updatedComments = [...postComments, comment];
				}
				state.openedPost!.comments = updatedComments;
			})
			.addCase(addCommentToPost.rejected, (state) => {})

			.addCase(deletePost.pending, (state) => {})
			.addCase(deletePost.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
				const { postId } = action.payload;
				state.posts.data = state.posts.data.filter((post) => post._id !== postId);
			})
			.addCase(deletePost.rejected, (state) => {})

			.addCase(editPost.pending, (state) => {})
			.addCase(
				editPost.fulfilled,
				(state, action: PayloadAction<{ router: AppRouterInstance; postId: string }>) => {
					const { router, postId } = action.payload;
					router.push(`/post/${postId}`);
				},
			)
			.addCase(editPost.rejected, (state) => {});
	},
});

export const { setPage, setReplyForm, updatePostLikes } = postSlice.actions;
export default postSlice.reducer;

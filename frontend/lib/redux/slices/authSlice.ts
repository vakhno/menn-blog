import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authorType, postType } from '@/types/types';
import axios from '@/lib/axios/axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type initialStateType = {
	isAuthorized: boolean;
	status: 'loaded' | 'loading' | 'error';
	isEditable: boolean;
	editablePost: null | postType;
	user: null | authorType;
};

type authRequestType = {
	user: authorType;
	success: boolean;
	error?: string;
};

type requestStatusType = {
	success: boolean;
};

export const signIn = createAsyncThunk(
	'auth/signIn',
	async (params: { fields: { email: string; password: string }; router: AppRouterInstance }) => {
		return new Promise<{ user: authorType; router: AppRouterInstance }>((resolve, rejected) => {
			setTimeout(async () => {
				try {
					const { fields, router } = params;
					// { withCredentials: true } need to set cookies inside nodeJs controller
					const result = await axios.post('/auth/signin', fields, {
						withCredentials: true,
					});
					const { success, user }: authRequestType = result.data;
					if (success) {
						resolve({ user, router });
					} else {
						rejected();
					}
				} catch (error) {
					rejected(error);
				}
			}, 1500);
		});
	},
);

export const signUp = createAsyncThunk(
	'auth/signUp',
	async (params: {
		fields: { name: string; email: string; password: string };
		router: AppRouterInstance;
		avatar: null | File;
	}) => {
		return new Promise<{ user: authorType; router: AppRouterInstance }>((resolve, rejected) => {
			setTimeout(async () => {
				try {
					const { fields, router, avatar } = params;
					const result = await axios.post('/auth/signup', fields, { withCredentials: true });
					const { success, user }: authRequestType = result.data;
					if (success) {
						if (avatar) {
							const formData = new FormData();
							formData.append('id', user._id);
							formData.append('avatar', avatar);
							await axios.post('/auth/avatar-upload', formData, {
								withCredentials: true,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							});
						}
						resolve({ user, router });
					} else {
						rejected();
					}
				} catch (error) {
					rejected(error);
				}
			}, 1500);
		});
	},
);

export const googleAuth = createAsyncThunk('auth/google', async () => {
	const result = await axios.get('/auth/google');
	const { url } = result.data;
	window.location.href = url;
});

export const isUserAuthorized = createAsyncThunk('auth/isUserAuthorized', async () => {
	try {
		// { withCredentials: true } need to read cookies inside nodeJs controller
		const result = await axios.get('/auth/profile', { withCredentials: true });
		const { user, success }: authRequestType = result.data;
		if (success) {
			return { user };
		} else {
			throw new Error();
		}
	} catch (error) {
		throw new Error();
	}
});

export const updateUserLikes = createAsyncThunk(
	'auth/updateUserLikes',
	async (params: { postId: string; userId: string }) => {
		try {
			const { postId, userId } = params;
			const result = await axios.post('/post/like-post', { postId, userId });
			const { success }: requestStatusType = result.data;
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

export const likeComment = createAsyncThunk(
	'auth/likeComment',
	async (params: { commentId: string; userId: string }) => {
		try {
			const { commentId, userId } = params;
			const result = await axios.post('/post/like-comment', { commentId, userId });
			const { success }: requestStatusType = result.data;
			if (success) {
				return { commentId };
			} else {
				throw new Error();
			}
		} catch (error) {
			throw new Error();
		}
	},
);

export const getEditPost = createAsyncThunk(
	'post/getEditPost',
	async (params: { postId: string }) => {
		try {
			const { postId: id } = params;
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
	},
);

const initialState: initialStateType = {
	isAuthorized: false,
	isEditable: false,
	editablePost: null,
	status: 'loaded',
	user: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state, action) => {
			const { router } = action.payload;
			state.user = null;
			state.isAuthorized = false;
			// removing token from cookies
			document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			router.push('/');
		},
		cleanEditablePost: (state, _) => {
			state.editablePost = null;
		},
		checkIsEditable: (state, action) => {
			const { postId } = action.payload;
			const isUserPost = state.user && state.user.posts.find((post) => post === postId);
			if (isUserPost) {
				state.isEditable = true;
			} else {
				state.isEditable = false;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			// sign in
			.addCase(signIn.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(
				signIn.fulfilled,
				(state, action: PayloadAction<{ user: authorType; router: AppRouterInstance }>) => {
					const { user, router } = action.payload;
					state.status = 'loaded';
					state.isAuthorized = true;
					state.user = user;
					router.push('/');
				},
			)
			.addCase(signIn.rejected, (state) => {
				state.status = 'error';
			})
			// sign up
			.addCase(signUp.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(
				signUp.fulfilled,
				(state, action: PayloadAction<{ user: authorType; router: AppRouterInstance }>) => {
					const { user, router } = action.payload;
					state.status = 'loaded';
					state.isAuthorized = true;
					state.user = user;
					router.push('/');
				},
			)
			.addCase(signUp.rejected, (state) => {
				state.status = 'error';
			})
			// checking if user authorized
			.addCase(isUserAuthorized.pending, (state) => {})
			.addCase(isUserAuthorized.fulfilled, (state, action: PayloadAction<{ user: authorType }>) => {
				const { user } = action.payload;
				state.isAuthorized = true;
				state.user = user;
			})
			.addCase(isUserAuthorized.rejected, (state) => {})
			// like post
			.addCase(updateUserLikes.pending, (state) => {})
			.addCase(updateUserLikes.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
				const { postId } = action.payload;
				if (state.user) {
					const isAlreadyLiked = state.user.likedPosts.some((likedPost) => likedPost === postId);
					if (isAlreadyLiked) {
						state.user.likedPosts = state.user.likedPosts.filter(
							(likedPost) => likedPost !== postId,
						);
					} else {
						state.user.likedPosts = [...state.user.likedPosts, postId];
					}
				}
			})
			.addCase(updateUserLikes.rejected, (state) => {})
			// like comment
			.addCase(likeComment.pending, (state) => {})
			.addCase(likeComment.fulfilled, (state, action: PayloadAction<{ commentId: string }>) => {
				const { commentId } = action.payload;
				if (state.user) {
					const isAlreadyLiked = state.user.likedComments.some(
						(likedComment) => likedComment === commentId,
					);
					if (isAlreadyLiked) {
						state.user.likedComments = state.user.likedComments.filter(
							(likedComment) => likedComment !== commentId,
						);
					} else {
						state.user.likedComments = [...state.user.likedComments, commentId];
					}
				}
			})
			.addCase(likeComment.rejected, (state) => {})
			// get edit post
			.addCase(getEditPost.pending, () => {})
			.addCase(getEditPost.fulfilled, (state, action: PayloadAction<{ post: postType }>) => {
				const { post } = action.payload;
				state.editablePost = post;
			})
			.addCase(getEditPost.rejected, () => {})
			// google auth
			.addCase(googleAuth.pending, (state) => {})
			.addCase(googleAuth.fulfilled, (state) => {})
			.addCase(googleAuth.rejected, () => {});
	},
});

export const { logout, checkIsEditable, cleanEditablePost } = authSlice.actions;
export default authSlice.reducer;

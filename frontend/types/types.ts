export type authorType = {
	_id: string;
	name: string;
	email: string;
	avatar: string;
	posts: string[];
	likedComments: string[];
	likedPosts: string[];
	createdAt: string;
	updatedAt: string;
};

export type postType = {
	_id: string;
	title: string;
	image: string;
	description: string;
	text: string;
	author: authorType;
	likes: number;
	viewsCount: number;
	comments: commentType[];
	tags: tagType[];
	createdAt: string;
	updatedAt: string;
};

export type commentType = {
	_id: string;
	author: authorType;
	post: postType;
	text: string;
	likes: number;
	replies: commentType[];
	createdAt: string;
	updatedAt: string;
};

export type tagType = {
	_id: string;
	value: string;
	label: string;
	popularity: number;
};

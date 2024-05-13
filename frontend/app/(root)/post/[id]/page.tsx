'use client';
import React, { useEffect } from 'react';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FullPost from '@/components/shared/FullPost/FullPost';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openPost } from '@/lib/redux/slices/postSlice';
import { useAuthorized } from '@/hooks/useAuthorized';
import { commentsCount } from '@/utils/comments';

const page = () => {
	useAuthorized();
	const { id } = useParams<{ id: string }>();
	const { openedPost, status } = useAppSelector((state) => state.post);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(openPost({ id }));
	}, []);

	return status === 'loading' ? null : status === 'loaded' && openedPost ? (
		<FullPost
			id={openedPost._id}
			title={openedPost.title}
			description={openedPost.description}
			text={openedPost.text}
			image={openedPost.image}
			tags={openedPost.tags}
			viewsCount={openedPost.viewsCount}
			author={openedPost.author}
			likesCount={openedPost.likes}
			commentsCount={commentsCount(openedPost.comments)}
		/>
	) : null;
};

export default page;

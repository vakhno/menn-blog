'use client';
import React, { useEffect, useState } from 'react';
// UI components
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
// components
import TextareaForm from '@/components/shared/TextareaForm/TextareaForm';
import PostTags from '@/components/shared/PostTags/PostTags';
import PostSocialActivity from '@/components/shared/PostSocialActivity/PostSocialActivity';
import PostComments from '@/components/shared/PostComments/PostComments';
import PostActions from '@/components/shared/PostActions/PostActions';
// froala
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// zod
import { z } from 'zod';
// next tools
import { useRouter } from 'next/navigation';
// types
import { tagType, authorType, commentType } from '@/types/types';
// redux
import { openPost } from '@/lib/redux/slices/postSlice';
import { setReplyForm } from '@/lib/redux/slices/postSlice';
// redux hooks
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

type Props = {
	id: string;
	classNames?: string;
	author?: authorType;
	title: string;
	description: string;
	text: string;
	image: string;
	tags: tagType[];
	commentsCount: number;
	likesCount: number;
	comments: commentType[];
};

const TextareaFormValidationSchema = z.object({
	text: z.string().min(1, { message: 'Comment is too short!' }),
});

const newComment = async (params: {
	parentId?: string;
	userId: string | null;
	comment: string;
	postId: string;
	comments: commentType[];
}) => {
	const { comments } = params;
	const response = await fetch('http://localhost:5555/post/send-comment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	});
	const result = await response.json();
	const { comment } = result;
	let updatedComments = [];
	updatedComments = [...comments, comment];
	return updatedComments;
};

const FullPost = ({
	id,
	author,
	image,
	title,
	description,
	text,
	tags,
	classNames,
	commentsCount,
	likesCount,
	comments,
}: Props) => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const router = useRouter();
	const user = useAppSelector((state) => state.auth.user);
	const userId = user?._id || null;
	const authorId = author?._id || null;
	const [allComments, setAllComments] = useState<commentType[]>(comments);
	const [comment, setComment] = useState<string>('');

	useEffect(() => {
		dispatch(openPost({ id }));
		const cleanUp = () => {
			dispatch(setReplyForm({ id: null }));
		};
		return cleanUp;
	}, []);

	const handleCommentChange = (value: string) => {
		setComment(value);
	};

	const SuccessCommentEntering = async () => {
		const newComments = await newComment({
			userId: userId,
			postId: id,
			comment: comment,
			comments: allComments,
		});
		setAllComments(newComments);
	};

	const ErrorCommentEntering = () => {
		toast({
			title: 'Error',
			description: `To comment you should Sign In`,
			variant: 'destructive',
			action: (
				<ToastAction altText="Sign In" onClick={() => router.push('/auth/signin')}>
					Sign In
				</ToastAction>
			),
		});
	};

	return (
		<Card className={`${classNames}`}>
			<CardHeader>
				<CardTitle className="break-words">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-6">
					{image ? (
						<img src={`${process.env.NEXT_PUBLIC_POSTS_UPLOAD_URI}${image}`} alt={title} />
					) : null}
				</div>
				<div className="mb-6">
					<FroalaEditorView model={text} />
				</div>
				<PostActions postId={id} userId={userId} authorId={authorId} />
				<div>
					<PostComments comments={allComments} postId={id} />
					<TextareaForm
						isSuccess={!!userId}
						handleChange={handleCommentChange}
						successEnter={SuccessCommentEntering}
						errorEnter={ErrorCommentEntering}
						validationSchema={TextareaFormValidationSchema}
						placeholder="Comment..."
					/>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between w-full">
					<PostTags tags={tags} />
					<PostSocialActivity likesCount={likesCount} commentsCount={commentsCount} />
				</div>
			</CardFooter>
		</Card>
	);
};

export default FullPost;

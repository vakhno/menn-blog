'use client';
import { useEffect, useState } from 'react';
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
// utils
import { commentsCount } from '@/utils/comments';
// react-query
import { useQuery } from '@tanstack/react-query';
// actions
import { getPostById } from '@/actions/posts';
import SomethingWentWrong from '@/components/shared/SomethingWentWrong/SomethingWentWrong';

type Props = {
	id: string;
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
	const { comments, parentId } = params;
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
	if (parentId) {
		const addingReplyToComment = (comment: commentType, reply: commentType, id: string) => {
			if (comment._id === id) {
				comment.replies = [...comment.replies, reply];
			} else {
				comment.replies.forEach((replyComment) => {
					addingReplyToComment(replyComment, reply, id);
				});
			}
		};
		updatedComments = [...comments];
		updatedComments.forEach((updateComment) => {
			addingReplyToComment(updateComment, comment, parentId);
		});
	} else {
		updatedComments = [...comments, comment];
	}
	return updatedComments;
};

const FullPost = ({ id }: Props) => {
	try {
		const { data } = useQuery({
			queryFn: () => getPostById(id),
			queryKey: ['postById'],
		});

		const { success } = data;

		if (!success) {
			throw new Error();
		}

		const { author, image, title, description, text, tags, classNames, likesCount, comments } =
			data.post;
		const dispatch = useAppDispatch();
		const { toast } = useToast();
		const router = useRouter();
		const user = useAppSelector((state) => state.auth.user);
		const userId = user?._id || null;
		const authorId = author?._id || null;
		const [allComments, setAllComments] = useState<commentType[]>(comments);

		useEffect(() => {
			dispatch(openPost({ id }));
			const cleanUp = () => {
				dispatch(setReplyForm({ id: null }));
			};
			return cleanUp;
		}, []);

		const SuccessCommentEntering = async (text: string, parentId?: string) => {
			const newComments = await newComment({
				userId: userId,
				postId: id,
				comment: text,
				comments: allComments,
				parentId: parentId,
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
						<PostComments
							comments={allComments}
							postId={id}
							successReply={(text, parentId) => SuccessCommentEntering(text, parentId)}
						/>
						<TextareaForm
							isSuccess={!!userId}
							successEnter={(text) => SuccessCommentEntering(text)}
							errorEnter={ErrorCommentEntering}
							validationSchema={TextareaFormValidationSchema}
							placeholder="Comment..."
						/>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex justify-between w-full">
						<PostTags tags={tags} />
						<PostSocialActivity
							likesCount={likesCount}
							commentsCount={commentsCount(allComments)}
						/>
					</div>
				</CardFooter>
			</Card>
		);
	} catch (error) {
		return <SomethingWentWrong />;
	}
};

export default FullPost;

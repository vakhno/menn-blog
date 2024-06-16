'use client';
import React, { useState } from 'react';
// UI components
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
// icons
import { FaUser } from 'react-icons/fa';
// components
import LikeCommentButton from '@/components/shared/LikeCommentButton/LikeCommentButton';
import TextareaForm from '@/components/shared/TextareaForm/TextareaForm';
// zod
import { z } from 'zod';
// utils
import { timestampToDate } from '@/utils/date';
// next tools
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// types
import { commentType } from '@/types/types';
// redux hooks
import { useAppSelector } from '@/lib/redux/hooks';

const TextareaFormValidationSchema = z.object({
	text: z.string().min(1, { message: 'Reply is too short!' }),
});

const newComment = async (params: {
	parentId?: string;
	userId: string | null;
	comment: string;
	postId: string;
	replies: commentType[];
}) => {
	const { replies } = params;
	const response = await fetch('http://localhost:5555/post/send-comment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	});
	const result = await response.json();
	const { comment } = result;
	let updatedReplies = [];
	updatedReplies = [...replies, comment];
	return updatedReplies;
};

type Props = {
	id: string;
	name: string | null;
	postId: string;
	date: Date | string;
	text: string;
	avatar: string | null;
	replies?: commentType[];
	isSocial: boolean;
};

const Comment = ({ id, name, postId, date, text, avatar, replies, isSocial }: Props) => {
	const { toast } = useToast();
	const router = useRouter();
	const user = useAppSelector((state) => state.auth.user);
	const userId = user?._id || null;
	const [isCommentReplyFormActive, setIsCommentReplyFormActive] = useState<boolean>(false);
	const [allReplies, setAllReplies] = useState<commentType[]>(replies || []);
	const [comment, setComment] = useState<string>('');

	const handleCommentChange = (value: string) => {
		setComment(value);
	};

	const SuccessCommentEntering = async () => {
		const newReplies = await newComment({
			userId: userId,
			postId: postId,
			comment: comment,
			parentId: id,
			replies: allReplies,
		});
		setAllReplies(newReplies);
		setIsCommentReplyFormActive(false);
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
		<div className="flex w-full gap-2 mb-4">
			<Avatar className="group relative cursor-pointer">
				<Link href="/">
					{avatar ? (
						<AvatarImage
							src={`${isSocial ? avatar : process.env.NEXT_PUBLIC_USERS_UPLOAD_URI + avatar}`}
							className="pointer-events-none w-full h-full"
						/>
					) : (
						<FaUser className="absolute w-full h-full justify-center items-center" />
					)}
				</Link>
			</Avatar>
			<div className="w-full">
				<div className="flex justify-between">
					<span>{name}</span>
					<span>{timestampToDate(date)}</span>
				</div>
				<div>{text}</div>
				<div className="flex justify-between">
					<div className="flex-col w-full">
						<div className="flex justify-between">
							{isCommentReplyFormActive ? (
								<Button
									className="mb-2"
									onClick={() => setIsCommentReplyFormActive(!isCommentReplyFormActive)}>
									Do not reply
								</Button>
							) : (
								<Button
									className="mb-2"
									onClick={() => setIsCommentReplyFormActive(!isCommentReplyFormActive)}>
									Reply
								</Button>
							)}
							<LikeCommentButton commentId={id} userId={userId} />
						</div>
						{isCommentReplyFormActive ? (
							<TextareaForm
								isSuccess={!!userId}
								handleChange={handleCommentChange}
								successEnter={SuccessCommentEntering}
								errorEnter={ErrorCommentEntering}
								validationSchema={TextareaFormValidationSchema}
								placeholder="Reply..."
							/>
						) : null}
						<div>
							{allReplies &&
								allReplies.map((reply: commentType) => (
									<Comment
										key={reply._id}
										id={reply._id}
										postId={postId}
										text={reply.text}
										name={reply.author?.name || ''}
										date={reply.updatedAt}
										avatar={reply.author?.avatar || null}
										replies={reply.replies}
										isSocial={reply.author.isSocial}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;

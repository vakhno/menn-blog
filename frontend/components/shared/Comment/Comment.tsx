'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { timestampToDate } from '@/utils/date';
import { HiEmojiHappy } from 'react-icons/hi';
import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setReplyForm, addCommentToPost } from '@/lib/redux/slices/postSlice';
import LikeCommentButton from '@/components/shared/LikeCommentButton/LikeCommentButton';

import { commentType } from '@/types/types';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

const replyValidationSchema = z.object({
	reply: z.string().min(1, { message: 'Reply is too short!' }),
});

type ReplyFormValueTypes = {
	reply: string;
};

type Props = {
	id: string;
	parentId?: string | null;
	name: string | null;
	postId: string;
	date: Date | string;
	text: string;
	avatar: string | null;
	replies?: commentType[];
	likedComments: string[];
};

const Comment = ({
	id,
	name,
	postId,
	parentId,
	date,
	text,
	avatar,
	replies,
	likedComments,
}: Props) => {
	const { toast } = useToast();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const userId = user?._id || null;
	const { isCommentReplyFormActive } = useAppSelector((state) => state.post);
	const form = useForm<ReplyFormValueTypes>({
		defaultValues: {
			reply: '',
		},
		resolver: zodResolver(replyValidationSchema),
	});

	const handleReplySubmit = (values: { reply: string }) => {
		const { reply } = values;
		const fields = {
			comment: reply,
			userId,
			postId: postId,
			// checking if parentId then it is a reply if not a comment
			parentId: id,
		};
		if (userId) {
			dispatch(addCommentToPost(fields));
		} else {
			toast({
				title: 'Error',
				description: `To comment you should Sign In`,
				variant: 'destructive',
				action: (
					<ToastAction altText="Sign In" onClick={() => router.push('/signin')}>
						Sign In
					</ToastAction>
				),
			});
		}
	};

	return (
		<div className="flex w-full gap-2 mb-4">
			<Avatar className="group relative cursor-pointer">
				<Link href="/" prefetch={false}>
					{avatar ? (
						<AvatarImage
							src={`${process.env.NEXT_PUBLIC_USERS_UPLOAD_URI}${avatar}`}
							className="pointer-events-none w-full h-full"
						/>
					) : (
						<HiEmojiHappy className="absolute w-full h-full justify-center items-center" />
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
							{isCommentReplyFormActive === id ? (
								<Button className="mb-2" onClick={() => dispatch(setReplyForm({ id: null }))}>
									Do not reply
								</Button>
							) : (
								<Button className="mb-2" onClick={() => dispatch(setReplyForm({ id }))}>
									Reply
								</Button>
							)}
							<LikeCommentButton commentId={id} userId={userId} />
						</div>
						{isCommentReplyFormActive === id ? (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handleReplySubmit)}
									className="flex flex-col w-full">
									<FormField
										control={form.control}
										name="reply"
										render={({ field }) => (
											<FormItem className="mb-2">
												<FormControl>
													<Textarea placeholder="Comment..." className="resize-none" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{form.getValues('reply').length ? (
										<Button type="submit" className="self-end bg">
											Submit
										</Button>
									) : null}
								</form>
							</Form>
						) : null}
						<div>
							{replies &&
								replies.map((reply: commentType) => (
									<Comment
										key={reply._id}
										id={reply._id}
										parentId={id}
										postId={postId}
										text={reply.text}
										name={reply.author?.name || ''}
										date={reply.updatedAt}
										avatar={reply.author?.avatar || null}
										replies={reply.replies}
										likedComments={likedComments}
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

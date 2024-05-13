'use client';
import React, { useEffect } from 'react';
import { HiChatAlt } from 'react-icons/hi';
import { HiPencilAlt } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { HiHeart } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Comment from '@/components/shared/Comment/Comment';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

import { addCommentToPost, setReplyForm } from '@/lib/redux/slices/postSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { deletePost } from '@/lib/redux/slices/postSlice';

import LikePostButton from '@/components/shared/LikePostButton/LikePostButton';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { tagType, authorType, commentType } from '@/types/types';

type Props = {
	id: string;
	classNames?: string;
	author?: authorType;
	title: string;
	description: string;
	text: string;
	image: string;
	tags: tagType[];
	viewsCount: number;
	commentsCount: number;
	likesCount: number;
};

type CommentFormValueTypes = {
	comment: string;
};

const commentValidationSchema = z.object({
	comment: z.string().min(1, { message: 'Comment is too short!' }),
});

const FullPost = ({
	id,
	author,
	image,
	title,
	description,
	text,
	tags,
	classNames,
	viewsCount,
	commentsCount,
	likesCount,
}: Props) => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const router = useRouter();
	const user = useAppSelector((state) => state.auth.user);
	const userId = user?._id || null;
	const likedComments = user?.likedComments || [];
	const comments = useAppSelector((state) => state.post?.openedPost?.comments || []);
	const form = useForm<CommentFormValueTypes>({
		defaultValues: {
			comment: '',
		},
		resolver: zodResolver(commentValidationSchema),
	});

	const handleCommentSubmit = (values: { comment: string }) => {
		const { comment } = values;
		const fields = {
			comment,
			userId,
			postId: id,
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

	useEffect(() => {
		const cleanUp = () => {
			dispatch(setReplyForm({ id: null }));
		};
		return cleanUp;
	}, []);

	const handleDeleteClick = () => {
		dispatch(deletePost({ postId: id }));
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
				<div className="flex gap-2 justify-end mb-6">
					{userId && author && userId === author._id ? (
						<>
							<Link href={`/post/${id}/edit`} prefetch={false}>
								<Button variant="outline" size="icon">
									<HiPencilAlt />
								</Button>
							</Link>

							<Button variant="outline" size="icon" onClick={handleDeleteClick}>
								<HiTrash />
							</Button>
						</>
					) : null}
					<LikePostButton postId={id} userId={userId} />
				</div>
				<div>
					<h4 className="mb-2">Comments:</h4>
					<div className="mb-2">
						{comments.length ? (
							<>
								{comments.map((comment) => (
									<Comment
										key={comment._id}
										id={comment._id}
										postId={id}
										parentId={null}
										text={comment.text}
										name={comment.author.name}
										date={comment.updatedAt}
										avatar={comment.author.avatar}
										replies={comment.replies}
										likedComments={likedComments}
									/>
								))}
							</>
						) : (
							<span className="flex justify-center">no comments yet</span>
						)}
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCommentSubmit)}
							className="flex flex-col w-full">
							<FormField
								control={form.control}
								name="comment"
								render={({ field }) => (
									<FormItem className="mb-2">
										<FormControl>
											<Textarea placeholder="Comment..." className="resize-none" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{form.getValues('comment').length ? (
								<Button type="submit" className="self-end">
									Submit
								</Button>
							) : null}
						</form>
					</Form>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between w-full">
					<ul className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<li className="flex items-center" key={tag._id}>
								<Badge variant="outline">{tag.label}</Badge>
							</li>
						))}
					</ul>
					<ul className="flex">
						<li className="mr-2 flex items-center">
							<HiHeart className="mr-1" />
							<span>{likesCount}</span>
						</li>
						<li className="flex items-center">
							<HiChatAlt className="mr-1" />
							<span>{commentsCount}</span>
						</li>
					</ul>
				</div>
			</CardFooter>
		</Card>
	);
};

export default FullPost;

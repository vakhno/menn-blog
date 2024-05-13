'use client';
import React from 'react';
import { HiChatAlt } from 'react-icons/hi';
import { HiPencilAlt } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { HiHeart } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

import { timestampToDate } from '@/utils/date';
import { useAppSelector } from '@/lib/redux/hooks';
import Link from 'next/link';

import { useAppDispatch } from '@/lib/redux/hooks';
import { deletePost } from '@/lib/redux/slices/postSlice';

import LikePostButton from '@/components/shared/LikePostButton/LikePostButton';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { authorType, tagType } from '@/types/types';

type Props = {
	id: string;
	classNames?: string;
	author?: authorType;
	title: string;
	description: string;
	image: string;
	createdAt: string;
	tags: tagType[];
	viewsCount: number;
	commentsCount: number;
	likesCount: number;
};

const Post = ({
	id,
	author,
	image,
	title,
	description,
	createdAt,
	tags,
	classNames,
	viewsCount,
	commentsCount,
	likesCount,
}: Props) => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const _id = user?._id || null;

	const handleDeleteClick = () => {
		const isDeletionConfirmed = window.confirm('Do you realy want to delete post?');
		if (isDeletionConfirmed) {
			dispatch(deletePost({ postId: id }));
		}
	};

	return (
		<Card className={`${classNames} group`}>
			<CardHeader>
				<div className="flex items-center">
					<Avatar className="group w-10 h-10 relative cursor-pointer mr-2">
						<AvatarImage
							src={`${process.env.NEXT_PUBLIC_USERS_UPLOAD_URI}${author?.avatar}`}
							className="pointer-events-none"
						/>
					</Avatar>
					<span>{timestampToDate(createdAt)}</span>
				</div>
				<Link href={`/post/${id}`} prefetch={false}>
					<CardTitle className="break-words">{title}</CardTitle>
				</Link>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="relative flex flex-col mb-6">
					{image ? (
						<img
							className="m-auto"
							src={`${process.env.NEXT_PUBLIC_POSTS_UPLOAD_URI}${image}`}
							alt={title}
						/>
					) : null}
				</div>
				<div className="flex gap-2 justify-end">
					{_id && author && _id === author._id ? (
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
					<LikePostButton postId={id} userId={_id} />
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between w-full">
					<ul className="flex flex-wrap gap-2">
						{tags.map((tag: tagType) => (
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

export default Post;

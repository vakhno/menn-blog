'use client';
import React from 'react';
// icons
import { HiChatAlt } from 'react-icons/hi';
import { HiPencilAlt } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { HiHeart } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
// UI components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
// utils
import { timestampToDate } from '@/utils/date';
// redux hooks
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
// redux
import { deletePost } from '@/lib/redux/slices/postSlice';
// next tools
import Link from 'next/link';
// components
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
				<div className="flex items-center justify-between">
					<div className="flex items-center overflow-hidden w-full">
						<Avatar className="flex justify-center items-center group w-10 h-10 rounded-full relative cursor-pointer mr-2">
							{author?.avatar ? (
								<AvatarImage
									src={`${
										author.isSocial
											? author.avatar
											: process.env.NEXT_PUBLIC_USERS_UPLOAD_URI + author.avatar
									}`}
									className="pointer-events-none"
								/>
							) : (
								<FaUser className="w-full h-full" />
							)}
						</Avatar>
						<span className="whitespace-nowrap overflow-hidden text-ellipsis">{author?.name}</span>
					</div>
					<span className="whitespace-nowrap">{timestampToDate(createdAt)}</span>
				</div>
				<Link href={`/post/${id}`}>
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
							<Link href={`/post/${id}/edit`}>
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

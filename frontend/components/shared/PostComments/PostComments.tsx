import React from 'react';
// types
import { commentType } from '@/types/types';
// components
import Comment from '@/components/shared/Comment/Comment';

type Props = {
	comments: commentType[];
	postId: string;
	successReply: (text: string, parentId?: string) => void;
};

const PostComments = ({ comments, postId, successReply }: Props) => {
	return (
		<div>
			<h4 className="mb-2">Comments:</h4>
			<div className="mb-2">
				{comments.length ? (
					<>
						{comments.map((comment) => (
							<Comment
								key={comment._id}
								id={comment._id}
								postId={postId}
								text={comment.text}
								name={comment.author.name}
								date={comment.updatedAt}
								avatar={comment.author.avatar}
								replies={comment.replies}
								isSocial={comment.author.isSocial}
								successReply={(text, parentId) => successReply(text, parentId)}
							/>
						))}
					</>
				) : (
					<span className="flex justify-center">no comments yet</span>
				)}
			</div>
		</div>
	);
};

export default PostComments;

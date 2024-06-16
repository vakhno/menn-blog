import React from 'react';
// types
import { tagType } from '@/types/types';
// UI components
import { Badge } from '@/components/ui/badge';

type Props = {
	tags: tagType[];
};

const PostTags = ({ tags = [] }: Props) => {
	return (
		<ul className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<li className="flex items-center" key={tag._id}>
					<Badge variant="outline">{tag.label}</Badge>
				</li>
			))}
		</ul>
	);
};

export default PostTags;

import React from 'react';
// UI components
import { Separator } from '@/components/ui/separator';
// utils
import { cn } from '@/lib/utils';

type Props = {
	text: string;
	className: string;
};

const TextBetweenSeparates = ({ text = '', className = '' }: Props) => {
	return (
		<div className={cn('flex justify-center items-center overflow-hidden', className)}>
			<Separator />
			<span className="px-4">{text}</span>
			<Separator />
		</div>
	);
};

export default TextBetweenSeparates;

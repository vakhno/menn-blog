'use client';
import React from 'react';
// UI components
import { buttonVariants } from '@/components/ui/button';
// next tools
import Link from 'next/link';

type Props = {
	linkHref?: string;
	linkTitle?: string;
};

const SomethingWentWrong = ({ linkHref, linkTitle }: Props) => {
	return (
		<div className="flex flex-col justify-center items-center h-full text-center">
			<h2 className="font-bold text-[2.4rem] mb-4">Whoops, something went wrong!</h2>
			<p className="font-semibold text-[1.4rem] mb-4">
				Please either refresh the page or try later.
			</p>
			<Link
				className={buttonVariants({
					size: 'lg',
				})}
				href={linkHref || '/'}>
				{linkTitle || 'Home'}
			</Link>
		</div>
	);
};

export default SomethingWentWrong;

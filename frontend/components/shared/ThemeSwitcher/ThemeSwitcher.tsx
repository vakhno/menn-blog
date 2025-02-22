'use client';
import React, { useEffect, useState } from 'react';
// UI components
import { Button } from '@/components/ui/button';
// icons
import { Sun, Moon } from 'lucide-react';

type Props = { className?: string };

const ThemeSwitcher = ({ className = '' }: Props) => {
	const [theme, setTheme] = useState<'dark' | 'light'>(
		localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
	);

	useEffect(() => {
		if (!theme || theme === 'light') {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
		} else {
			document.body.classList.remove('light');
			document.body.classList.add('dark');
		}
		localStorage.setItem('theme', theme);
	}, [theme]);

	return (
		<Button
			size="icon"
			variant="secondary"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className={className}>
			{theme === 'dark' ? <Moon /> : <Sun />}
		</Button>
	);
};

export default ThemeSwitcher;

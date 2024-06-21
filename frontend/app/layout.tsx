// next tools
import type { Metadata } from 'next';
// fonts
import { Inter } from 'next/font/google';
// styles
import './globals.css';
// providers
import StoreProvider from './StoreProvider';
import QueryProvider from './QueryProvider';
// toaster
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Blog created by Vakhno',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `	if (
						localStorage.theme === 'dark' ||
						(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
					) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}`,
					}}
				/>
			</head>
			<body className={inter.className}>
				<main className="h-full">
					<StoreProvider>
						<QueryProvider>{children}</QueryProvider>
						<Toaster />
					</StoreProvider>
				</main>
			</body>
		</html>
	);
}

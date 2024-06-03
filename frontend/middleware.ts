'use server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
	const token = request.cookies.has('token') || null;
	if (!token) {
		return NextResponse.rewrite(new URL('/', request.url));
	} else {
		const result = await axios.get('/profile');
		const { success, user } = result.data;
		if (success) {
			window.localStorage.user = user;
		}
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth|post\\/\\w+).*)', '/profile'],
};

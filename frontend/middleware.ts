'use server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.has('token') || null;
	if (!token) {
		return NextResponse.rewrite(new URL('/', request.url));
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|signin|signup|post\\/\\w+).*)'],
};

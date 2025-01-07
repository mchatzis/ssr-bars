import { NextResponse } from 'next/server';


export function middleware(request: Request) {
    console.log(`Request made to: ${request.url}`);

    return NextResponse.next();
}
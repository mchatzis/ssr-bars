import { NextResponse } from 'next/server';


export function middleware() {
    // console.log(`Request made to: ${request.url}`);

    return NextResponse.next();
}
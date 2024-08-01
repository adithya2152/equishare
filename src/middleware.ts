import { NextRequest, NextResponse } from 'next/server';
export function middleware(request:NextRequest)
{
    const userid  = request.cookies.get("uid");

    if(!userid)
    {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ['/dashboard', '/addexpense' , '/expenselogs']
}
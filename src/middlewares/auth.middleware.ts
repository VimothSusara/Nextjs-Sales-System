import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const { pathname, origin } = req.nextUrl
        const { token } = req.nextauth

        // Admin route protection
        if (pathname.startsWith('/dashboard/admin') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(`${origin}/dashboard/unauthorized`)
        }

        // Role-based redirects
        // if (pathname === '/dashboard') {
        //     if (token?.role === 'PURCHASE_MANAGER') {
        //         return NextResponse.redirect(`${origin}/dashboard/purchase-orders`)
        //     }
        //     if (token?.role === 'SALES_MANAGER') {
        //         return NextResponse.redirect(`${origin}/dashboard/sales`)
        //     }
        // }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: ['/dashboard/:path*'],
}   
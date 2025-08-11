import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from '@prisma/client'

declare module 'next-auth' {
    interface User {
        id: number
        username: string
        role: Role
    }

    interface Session {
        user: {
            id: number
            username: string
            role: Role
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number
        username: string
        role: Role
    }
}

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    cookies: {
        sessionStorage: {
            name: 'sales-system.session-token',
            option: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        }
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('No credentials provided')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                })

                if (!user) {
                    throw new Error('User not found')
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error('Invalid Credentials')
                }

                return {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.role = token.role
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
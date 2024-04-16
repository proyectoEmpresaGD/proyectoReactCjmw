import NextAuth from "next-auth";
import Google from "@auth/core/providers/github"
import Credentials from "@auth/core/providers/credentials"
//import { PrismaAdapter } from "@auth/prisma-adapter";
//import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "@/lib/data"

/*const options = {
    providers: [Google,
        Credentials({
            async authorize(credentials) {
                console.log('AUTHORIZE');
                return getUserByEmail(credentials.email)
            },
        })],
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token?.role
            return session
        },
        async jwt({ token }) {  

            const { role } = await prisma.user.findUnique({
                where: {
                    email: token.email
                }
            })
            token.role = role

            return token
        }
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth(options)
*/
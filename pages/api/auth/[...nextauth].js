import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
})

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401);
        res.end();
        throw 'not an admin';
    }
}
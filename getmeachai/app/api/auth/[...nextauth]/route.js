import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import connectDB from '@/db/connectDB';
import User from '@/models/User';


const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github") {
        await connectDB()
        const currentUser = await User.findOne({ email: email })
        if (!currentUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email.split('@')[0]
          })
        }
      }
      if (account.provider === "google") {
        await connectDB()
        const currentUser = await User.findOne({ email: email })
        if (!currentUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email.split('@')[0]
          })
        }
        
      }
      return true
    },

    async session({ session, token, user }) {
      const dbUser = await User.findOne({ email: session.user.email })
      session.user.name = dbUser.username

      return session
    }
  },
});

export { handler as GET, handler as POST }; // <-- for App Router (Next.js 13+)

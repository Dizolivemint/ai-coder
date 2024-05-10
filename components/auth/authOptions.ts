import GitHubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth'
import { profile } from 'console';

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Missing environment variables for GitHub OAuth');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId,
      clientSecret,
      authorization: {
        params: { scope: 'read:user, repo, starring: read' }, // Scope to read user information
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account, profile }) {
        if (user) token.user = user;
        if (profile) token.profile = profile;
        if (account?.access_token) {
          token.accessToken = account.access_token;
        }
        return token;
    },
    session({ session, token }) {
      if (session.user)
          session.user = {
              ...session.user,
              username: (token.profile as any).login,
          } as any;
      return session;
    },
  },
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1 * 60 * 60, // 1 hour

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
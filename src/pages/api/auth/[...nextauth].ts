import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as queryFauna } from 'faunadb'

import { fauna } from '../../../services/faunadb';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
          params: {
              scope: 'read:user',
          }
      },
    }),
  ],
  
  callbacks: {
      async signIn({user, account, profile}) {
        const { email } = user

        try {
            await fauna.query(
                queryFauna.If(
                    queryFauna.Not(
                        queryFauna.Exists(
                            queryFauna.Match(
                                queryFauna.Index('user_by_email'),
                                queryFauna.Casefold(user.email)
                            )
                        )
                    ),
                    queryFauna.Create(
                        queryFauna.Collection('users'),
                        { data: { email }}
                    ),
                    queryFauna.Get(
                        queryFauna.Match(
                            queryFauna.Index('user_by_email'),
                            queryFauna.Casefold(user.email)
                        )
                    )
                )
            )

            return true
        } catch {
            return false
        }

      }
  }
})
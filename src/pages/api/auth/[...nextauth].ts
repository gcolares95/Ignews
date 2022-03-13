import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Salvando no banco após login
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            // Se o user NAO existe
            q.Not(
              q.Exists(
                q.Match( // comparado ao where
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            // se o user já existe
            q.Get( // comparado ao Select
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true; // retorna true se login deu certo
      } catch {
        return false; // evita que o user faça login se nossa app não conseguiu fazer interaçãp c/ banco
      }
    },
  }
})
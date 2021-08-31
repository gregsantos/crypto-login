import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import * as fcl from '@onflow/fcl'

const verify = async (msg, compSigs) => {
  try {
    return await fcl.verifyUserSignatures(msg, JSON.parse(compSigs))
  } catch (e) {
    return false
  }
}

const options = {
  providers: [
    Providers.Credentials({
      name: 'Crypto Wallet',

      async authorize(credentials, req) {
        const { compSigs, msg } = credentials
        const baseUrl = process.env.BASE_URL

        const verified = await verify(msg, compSigs)

        if (verified) {
          const res = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          })

          const user = await res.json()
          if (res.ok && user) {
            return user
          } else {
            throw new Error('error logging in')
          }
        } else {
          throw new Error('error verifying signature')
        }
      },
    }),
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)

  // database: process.env.DATABASE_URL,

  // Database Adapter https://next-auth.js.org/adapters/overview
  // adapter: Adapters.Prisma.Adapter({ prisma }),

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  // secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
  },

  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = user ? true : false

      if (isUserSignedIn) {
        token.address = user.address
      }
      return token
    },

    async session(session, token) {
      session.user.id = token.id
      session.user.address = token.address
      return session
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  // events: {},

  theme: 'dark',
  debug: true,
}

export default NextAuth(options)

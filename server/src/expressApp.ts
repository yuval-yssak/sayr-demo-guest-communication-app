/** This module sets up the express application with the following middleware:
 *
 * 1. CookieParser - for handling httpOnly cookies for the refresh token.
 *                   The refresh token is valid as long as the user is logged in
 *                   It is used to periodically exchange the access token.
 *
 * 2. cors         - allow the client URL only as origin
 *
 * 3. session      - during an OAuth authentication, store the oauth profile
 *                   on the server in-memory for 5 seconds only to allow the
 *                   client to securely request the tokens upon successfully
 *                   finishing the Oauth login process.
 *                   This session is put in use when the server redirects the
 *                   client back to the client app url, the session remains
 *                   valid for 5 seconds, allowing the user to fetch the tokens
 *                   from the server url.
 *
 * 4. passport     - OAuth setup
 */

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from './passport'

const app = express()

app.use(cookieParser())
app.use(cors({ credentials: true, origin: /^http:\/\/localhost:.*$/ }))

// this session serves to hold the Oauth profile information
// while the client is shifting between server and client URLs.
// After the redirect to the client rendering app, the client calls the mutation
// "finishLoginWithGoogle" in which it gets the access and refresh tokens.
app.use(
  session({
    secret: 'b1a8qzzuzpvw8jewx2vysqqh2hq8lcgwqyd92j01ol',
    name: 'oauth-bridge',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 5, // 5 seconds only. Cookie should die after client first redirect
      secure: process.env.NODE_ENV === 'production'
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

export default app

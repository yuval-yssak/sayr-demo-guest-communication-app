/** This module sets up the express application with the following middleware:
 *
 * 1. CookieParser - for handling httpOnly cookies for the refresh token.
 *                   The refresh token is valid as long as the user is logged in
 *                   It is used to periodically exchange the access token.
 *
 * 2. cors         - allow the client URL only as origin
 *
 * 3. session      - during an OAuth authentication, store the oauth profile
 *                   on the server session for 25 seconds only to allow the
 *                   client to securely request the tokens upon successfully
 *                   finishing the Oauth login process.
 *                   This session is put in use when the server redirects the
 *                   client back to the client app url, the session remains
 *                   valid for 25 seconds, allowing the user to fetch the tokens
 *                   from the server url.
 *
 * 4. passport     - OAuth setup
 */

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from './passport'
import {
  session as sessionConfig,
  mongoDBConfig,
  clientGuestAppBaseURL,
  clientStaffAppBaseURL
} from './config/config'
import ConnectMondbSession from 'connect-mongodb-session'

const app = express()

app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: [
      /^http:\/\/localhost:.*$/,
      clientGuestAppBaseURL,
      clientStaffAppBaseURL
    ]
  })
)

const MongoDBStore = ConnectMondbSession(session)
const store = new MongoDBStore({
  uri: mongoDBConfig.DBUrl,
  databaseName: mongoDBConfig.dbName,
  collection: 'mySessions'
})

store.on('error', function (error) {
  console.log(error)
})

// let redisClient = redis.createClient()

/**
 * In Heroku, all requests come into the application as plain http but they have
 * the header X-Forwarded-Proto to know whether the original request was http or
 * https. That causes express to see non-ssl traffic and so it refuses to set a
 * secure cookie when running on Heroku. Express will only send secure cookies
 * over https. You have to tell express to trust the information in the
 * X-Forwarded-Proto header, i.e. that the original request was over https,
 * by enabling the 'trust proxy' setting.
 */
app.set('trust proxy', 1)

// this session serves to hold the Oauth profile information
// while the client is shifting between server and client URLs.
// After the redirect to the client rendering app, the client calls the mutation
// "finishLoginWithGoogle" in which it gets the access and refresh tokens.

app.use(
  session({
    store,
    secret: sessionConfig.secret,
    name: 'oauth-bridge',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 25, // 25 seconds only. Cookie should die after client first redirect
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

export default app

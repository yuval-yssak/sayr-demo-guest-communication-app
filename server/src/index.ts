import express from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'
import { loadDataAccess } from './loaders/mainLoader'
import cookieParser from 'cookie-parser'
import { UserType } from './auth/auth'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'
import usersDAO from './dao/usersDAO'
import { ObjectId } from 'mongodb'
import { CalendarResolver } from './calendarResolver'
import authRoutes from './routes/authRoutes'

const app = express()
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
)

// this session serves to hold the Oauth profile information
// while the client is shifting between server and client URLs.
// After the redirect to the client rendering app, the client calls the mutation
// "finishLoginWithGoogle" in which it gets the access and refresh tokens.
app.use(
  session({
    secret: 'my-secret',
    name: 'the-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 5, // 5 seconds only. Cookie should die after client first redirect
      secure: process.env.NODE_ENV === 'production'
    }
  })
)

async function start() {
  await loadDataAccess()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver, CalendarResolver] }),
    context: ({ req, res }) => ({ req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })
  app.listen(4000, () => console.log('listening on port 4000.'))
}

start()

const verifyFunction = async function (
  accessToken: string,
  refreshToken: string,
  profile: any,
  cb: Function
) {
  const profileEmail: string = profile.emails[0].value

  let user: UserType = (
    await usersDAO.findArray({
      email: profileEmail
    })
  )?.[0]

  if (
    user
    // && !user.googleProfile
  ) {
    usersDAO.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { googleProfile: { ...profile, accessToken, refreshToken } } }
    )
  } else if (!user) {
    try {
      user = await usersDAO
        .insertOne({
          email: profileEmail,
          password: null,
          tokenVersion: 0
        })
        .then(writeOp => writeOp.insertedId)
        .then(_id => usersDAO.findArray({ _id: new ObjectId(_id) }))
        .then(array => array?.[0])
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  cb(null, user)
}
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1053321495897-vgj5hu2dqo1utpps5mqnrt0tfn160955.apps.googleusercontent.com',
      clientSecret: '33dKswmH65gXmZCWm10e_r42',
      callbackURL: 'http://localhost:4000/login-with-google/cb'
    },
    verifyFunction
  )
)

app.use(passport.initialize())
app.use(passport.session())
authRoutes(app)

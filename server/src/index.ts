import express, { Request, Response } from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'
import { loadDataAccess } from './loaders/mainLoader'
import cookieParser from 'cookie-parser'
import { exchangeToken, UserType } from './auth'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'
import usersDAO from './dao/usersDAO'
import { ObjectId } from 'mongodb'
import { CalendarResolver } from './calendarResolver'

const app = express()
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
)
app.use(
  session({
    secret: 'my-secret',
    name: 'the-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 5, // cookie should die after client first redirect
      secure: process.env.NODE_ENV === 'production'
    }
  })
)

app.get('/', (_req, res) => res.send('hello'))

app.post('/refresh-token', exchangeToken)

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

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1053321495897-vgj5hu2dqo1utpps5mqnrt0tfn160955.apps.googleusercontent.com',
      clientSecret: '33dKswmH65gXmZCWm10e_r42',
      callbackURL: 'http://localhost:4000/login-with-google/cb'
    },
    async function (
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

      // here i'm supposed to set up any server data on the google connection

      cb(null, user)
    }
  )
)

app.get(
  '/login-with-google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    includeGrantedScopes: true
  })
)

app.get(
  '/google/AllowCalendar',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    accessType: 'offline',
    includeGrantedScopes: true
  })
)

app.get(
  '/google/AllowDrive',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/drive'],
    accessType: 'offline',
    includeGrantedScopes: true
  })
)

app.get(
  '/login-with-google/cb',
  passport.authenticate('google', { session: false }),
  (req: Request, res: Response) => {
    // const appAccessToken = createAccessToken(<UserType>req.user)
    // const appRefreshToken = createRefreshToken(<UserType>req.user)

    // res.cookie('rx', refreshToken:appRefreshToken, { httpOnly: true, path: '/refresh-token' })

    // return { accessToken, user }

    req.session!.user = req.user

    res.redirect('http://localhost:3000/after-google-login')
  }
)

app.use(passport.initialize())
app.use(passport.session())

app.get('/subsequent-call-after-google-login', (req, res) => {
  console.log(req.session)
  res.send('thanks')
})

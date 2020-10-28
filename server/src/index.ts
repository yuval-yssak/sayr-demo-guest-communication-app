import express, { Request, Response } from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './userResolvers'
import { loadDataAccess } from './loaders/mainLoader'
import cookieParser from 'cookie-parser'
import { exchangeToken } from './auth'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const app = express()
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
)
app.get('/', (_req, res) => res.send('hello'))

app.post('/refresh-token', exchangeToken)

async function start() {
  await loadDataAccess()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
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
      callbackURL: 'http://localhost:4000/cb'
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      cb: Function
    ) {
      console.log('in callback???', accessToken, refreshToken, profile, cb)
      cb(null, profile)
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
)

app.get(
  '/login-with-google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get(
  '/cb',
  passport.authenticate('google', { session: false }),
  (_req: Request, res: Response) => {
    console.log('auth good')
    res.send('auth Good!!!')
  }
)

app.use(passport.initialize())

import { Request, Response, Express } from 'express'
import { exchangeToken } from '../auth/auth'
import passport from 'passport'

const authRoutes = (app: Express) => {
  app.get('/', (_req, res) => res.send('hello'))

  app.post('/refresh-token', exchangeToken)

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

  // store server-side cookie session for 5 seconds and
  // redirect the client back to the client app.
  app.get(
    '/login-with-google/callback',
    passport.authenticate('google', { session: false }),
    (req: Request, res: Response) => {
      req.session!.user = req.user

      res.redirect('http://localhost:3000/after-google-login')
    }
  )
}

export default authRoutes

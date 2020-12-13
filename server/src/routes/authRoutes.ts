import { Request, Response, Express } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { exchangeToken } from '../auth/auth'
import UsersDAO from '../dao/usersDAO'

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

  app.get(
    '/verify-email/:id',
    async (req, res): Promise<void> => {
      const requestID = req.params.id
      const user = (
        await UsersDAO.findArray({
          'login.emailVerification.requestID': new ObjectId(requestID),
          'login.emailVerification.requestExpiresOn': { $gte: new Date() }
        })
      )?.[0]
      if (user) {
        await UsersDAO.updateOne(
          { _id: user._id },
          {
            $unset: {
              'login.emailVerification.requestID': '',
              'login.emailVerification.requestExpiresOn': ''
            },
            $set: {
              'login.emailVerification.verified': true
            }
          }
        )
      } else {
        res
          .status(400)
          .send('Did not find a user with your email from the last 48 hours')
        return
      }
      res.send(
        '<p>Great, you are verified.</p><a href="http://localhost:3000">Click here to head on to the app.</a>'
      )
      // todo: redirect to automatically log the user in.
      return
    }
  )
}

export default authRoutes

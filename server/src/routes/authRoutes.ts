import { Request, Response, Express } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { AuthenticateOptionsGoogle } from 'passport-google-oauth20'
import { exchangeToken } from '../auth/auth'
import UsersDAO from '../dao/UsersDAO'

const authRoutes = (app: Express) => {
  app.get('/', (_req, res) => res.send('hello'))

  app.post('/refresh-token', exchangeToken)

  app.get(
    '/guest-app/login-with-google',
    passport.authenticate('guest-app-google', {
      scope: ['profile', 'email'],
      accessType: 'offline',
      includeGrantedScopes: true
    } as AuthenticateOptionsGoogle)
  )

  app.get(
    '/staff-app/login-with-google',
    passport.authenticate('staff-app-google', {
      scope: ['profile', 'email'],
      accessType: 'offline',
      includeGrantedScopes: true
    } as AuthenticateOptionsGoogle)
  )

  // store server-side cookie session for 5 seconds and
  // redirect the client back to the client app.
  app.get(
    '/guest-app/login-with-google/callback',
    passport.authenticate('guest-app-google', { session: false }),
    (req: Request, res: Response) => {
      req.session!.user = req.user
      res.redirect(
        `${process.env.CLIENT_GUEST_APP_BASE_URL}/after-google-login`
      )
    }
  )

  // store server-side cookie session for 5 seconds and
  // redirect the client back to the client app.
  app.get(
    '/staff-app/login-with-google/callback',
    passport.authenticate('staff-app-google', { session: false }),
    (req: Request, res: Response) => {
      req.session!.user = req.user
      res.redirect(
        `${process.env.CLIENT_STAFF_APP_BASE_URL}/after-google-login`
      )
    }
  )

  app.get(
    '/verify-email/:id',
    async (req, res): Promise<void> => {
      const requestID = req.params.id
      console.log({
        'emailVerification.requestID': requestID,
        'emailVerification.requestExpiresOn': { $gte: new Date() }
      })
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

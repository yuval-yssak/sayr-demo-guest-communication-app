import { Request, Response, Express } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { AuthenticateOptionsGoogle } from 'passport-google-oauth20'
import { createTokensAfterPasswordVerified, exchangeToken } from '../auth/auth'
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

  // store server-side cookie session for 25 seconds and
  // redirect the client back to the client app.
  app.get(
    '/guest-app/login-with-google/callback',
    passport.authenticate('guest-app-google', { session: false }),
    (req: Request, res: Response) => {
      ;(req.session as any).user = req.user
      res.redirect(
        `${process.env.CLIENT_GUEST_APP_BASE_URL}/after-google-login`
      )
    }
  )

  // store server-side cookie session for 25 seconds and
  // redirect the client back to the client app.
  app.get(
    '/staff-app/login-with-google/callback',
    passport.authenticate('staff-app-google', { session: false }),
    (req: Request, res: Response) => {
      ;(req.session as any).user = req.user

      res.redirect(
        `${process.env.CLIENT_STAFF_APP_BASE_URL}/after-google-login`
      )
    }
  )

  app.get(
    '/:app/verify-email/:id',
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

      const [updatedUser] = await UsersDAO.findArray({
        _id: new ObjectId(user._id)
      })

      createTokensAfterPasswordVerified(updatedUser, res)

      res.redirect(
        `${
          req.params.app === 'staff-app'
            ? process.env.CLIENT_STAFF_APP_BASE_URL
            : process.env.CLIENT_GUEST_APP_BASE_URL
        }/login-verified`
      )
    }
  )
}

export default authRoutes

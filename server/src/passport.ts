import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile
} from 'passport-google-oauth20'
import UsersDAO, { PermissionLevel } from './dao/UsersDAO'
import { googleOAuthStaffApp, googleOAuthGuestApp } from './config/config'

// this is a middleware called during an OAuth login authentication.
async function connectOauthToDB(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  callback: VerifyCallback
) {
  // capture the user's first email from the OAuth profile
  const profileEmail: string = profile.emails?.[0].value || ''

  let user = (await UsersDAO.findArray({ email: profileEmail }))?.[0]

  if (user) {
    // If the user is registered, update its profile along with the auth tokens
    await UsersDAO.updateOne(
      { _id: user._id },
      {
        $set: {
          login: {
            ...user.login,
            oauth: { google: { profile, accessToken, refreshToken } }
          }
        }
      }
    )
  } else if (!user) {
    // if the user has not registered before, create it and copy its profile.

    try {
      const isThisFirstUser = (await UsersDAO.countDocuments()) === 0
      const permissionLevel = isThisFirstUser
        ? PermissionLevel.Admin
        : PermissionLevel.None

      const insertResult = await UsersDAO.insertOne({
        email: profileEmail,
        login: {
          password: null,
          tokenVersion: 0,
          oauth: { google: { profile, accessToken, refreshToken } }
        },
        invitationsSent: [],
        permissionLevel,
        subscriptions: []
      })

      user = (
        await UsersDAO.findArray({
          _id: insertResult.insertedId
        })
      )?.[0]
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // now the OAuth profile has a corresponding document in the db.
  // Proceed to the callback route.
  callback(undefined, user)
}

passport.use(
  'guest-app-google',
  new GoogleStrategy(
    {
      clientID: googleOAuthGuestApp.clientID,
      clientSecret: googleOAuthGuestApp.clientSecret,
      callbackURL: googleOAuthGuestApp.callbackURL
    },
    connectOauthToDB
  )
)

passport.use(
  'staff-app-google',
  new GoogleStrategy(
    {
      clientID: googleOAuthStaffApp.clientID,
      clientSecret: googleOAuthStaffApp.clientSecret,
      callbackURL: googleOAuthStaffApp.callbackURL
    },
    connectOauthToDB
  )
)

export default passport

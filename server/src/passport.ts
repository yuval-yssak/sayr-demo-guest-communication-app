import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile
} from 'passport-google-oauth20'
import PersonsDAO from './dao/PersonsDAO'
import UsersDAO, { PermissionLevel } from './dao/UsersDAO'

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
    console.log('updating oauth in passport')
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
      // find relevant person
      // TODO: handle case when more than one person has this email. Give prioirty if this person is in house.
      const personsWithThisEmail = await PersonsDAO.findArray({
        email: profileEmail
      })

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
        personId: personsWithThisEmail?.[0].id,
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
  new GoogleStrategy(
    {
      clientID:
        '1053321495897-vgj5hu2dqo1utpps5mqnrt0tfn160955.apps.googleusercontent.com',
      clientSecret: '33dKswmH65gXmZCWm10e_r42',
      callbackURL: 'http://localhost:4000/login-with-google/callback'
    },
    connectOauthToDB
  )
)

export default passport

import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile
} from 'passport-google-oauth20'
import usersDAO from './dao/usersDAO'

const connectOauthToDB = async function (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  callback: VerifyCallback
) {
  // capture the user's first email from the OAuth profile
  const profileEmail: string = profile.emails?.[0].value || ''

  let user = (await usersDAO.findArray({ email: profileEmail }))?.[0]

  if (user) {
    // If the user is registered, update its profile along with the auth tokens

    usersDAO.updateOne(
      { _id: user._id },
      { $set: { oauth: { google: { profile, accessToken, refreshToken } } } }
    )
  } else if (!user) {
    // if the user has not registered before, create it and copy its profile.

    try {
      const insertResult = await usersDAO.insertOne({
        email: profileEmail,
        password: null,
        tokenVersion: 0,
        oauth: { google: { profile, accessToken, refreshToken } }
      })

      user = (
        await usersDAO.findArray({
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

import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(__dirname, '../../.env') })

const mongoDBConfig = {
  dbName: process.env.MONGO_DB_NAME!,
  DBUrl: process.env.MONGO_DB_URL!
}

const jwt = {
  secretKeyForAccess: process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKENS!,
  secretKeyForRefresh: process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKENS!
}

const email = {
  sendGridAPI: process.env.SENDGRID_EMAIL_API_KEY!
}

const session = {
  secret: process.env.SERVER_SESSION_SECRET!
}

const googleOAuthGuestApp = {
  clientID: process.env.GOOGLE_OAUTH_GUEST_APP_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_OAUTH_GUEST_APP_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_OAUTH_GUEST_APP_CALLBACK_URL!
}

const googleOAuthStaffApp = {
  clientID: process.env.GOOGLE_OAUTH_STAFF_APP_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_OAUTH_STAFF_APP_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_OAUTH_STAFF_APP_CALLBACK_URL!
}

const webPushVapid = {
  subject: process.env.WEB_PUSH_VAPID_SUBJECT!,
  publicKey: process.env.WEB_PUSH_VAPID_PUBLIC_KEY!,
  privateKey: process.env.WEB_PUSH_VAPID_PRIVATE_KEY!
}

const clientStaffAppBaseURL = process.env.CLIENT_STAFF_APP_BASE_URL!

const clientGuestAppBaseURL = process.env.CLIENT_GUEST_APP_BASE_URL!

export {
  mongoDBConfig,
  jwt,
  email,
  session,
  googleOAuthGuestApp,
  googleOAuthStaffApp,
  webPushVapid,
  clientStaffAppBaseURL,
  clientGuestAppBaseURL
}

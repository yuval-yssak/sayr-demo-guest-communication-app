import { ObjectId, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'
import { Profile } from 'passport-google-oauth20'

/**
 * Clarifications:
 * null password means that the user has an Oauth login but not an email/password login.
 * null personId means that the email has not been connected yet to a person_id from Retreat Guru.
 * tokenVersion allows to force unilaterally sign-out a user
 */
export type IUser = WithId<{
  personId: number | null
  email: string
  permissionLevel: 'none' | 'staff' | 'manager' | 'admin'
  login: {
    emailVerification?: {
      verified: boolean
      requestID?: ObjectId
      requestExpiresOn?: Date
    }
    password: string | null
    tokenVersion: number
    oauth?: {
      google?: {
        profile: Profile
        accessToken: string
        refreshToken: string
      }
    }
  }
  invitationsSent: { timestamp: Date; staff: number }[]
  subscriptions: {
    name: string
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }[]
}>

class UsersDAO extends AbstractDAO<IUser> {
  COLLECTION_NAME = 'users'
}

export default new UsersDAO()

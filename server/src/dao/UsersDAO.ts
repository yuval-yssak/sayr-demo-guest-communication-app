import { ObjectId, WithId } from 'mongodb'
import AbstractDAO from './AbstractDAO'
import { Profile } from 'passport-google-oauth20'

/**
 * Clarifications:
 * null password means that the user has an Oauth login but not an email/password login.
 * null personId means that the email has not been connected yet to a person_id from Retreat Guru.
 * tokenVersion allows to force unilaterally sign-out a user
 */

export enum PermissionLevel {
  None = 'none',
  Staff = 'staff',
  Manager = 'manager',
  Admin = 'admin'
}

export type IUser = WithId<{
  email: string
  permissionLevel: PermissionLevel
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
  invitationsSent: { timestamp: Date; staff: ObjectId }[]
  subscriptions: {
    userAgent: string
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

import { ObjectId, WithId } from 'mongodb'
import abstractDAO from './abstractDAO'
import { Profile } from 'passport-google-oauth20'

export type UserType = WithId<{
  email: string
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
}>

class usersDAO extends abstractDAO<UserType> {
  COLLECTION_NAME = 'users'
}

export default new usersDAO()

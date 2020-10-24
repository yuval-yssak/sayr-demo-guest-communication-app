import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectID } from 'mongodb'
import { jwt } from '../config/config'
import { sign } from 'jsonwebtoken'

@ObjectType()
class UserType {
  @Field(() => ID)
  _id: ObjectID

  @Field()
  email: string

  password: string
}

interface LoginPayload {
  userId: ObjectID
}

function createAccessToken(user: UserType): string {
  const payload: LoginPayload = { userId: user._id }
  return sign(payload, jwt.secretKeyForAccess, {
    expiresIn: '15m'
  })
}

function createRefreshToken(user: UserType): string {
  const payload: LoginPayload = { userId: user._id }
  return sign(payload, jwt.secretKeyForRefresh, {
    expiresIn: '7d'
  })
}

export { UserType, createAccessToken, createRefreshToken, LoginPayload }

import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { jwt } from '../../config/config'
import { sign } from 'jsonwebtoken'

import { Request, Response } from 'express'
import 'reflect-metadata'
import { verify } from 'jsonwebtoken'
import usersDao, { UserType } from '../dao/usersDAO'
import { MiddlewareFn } from 'type-graphql'

export interface MyContext {
  req: Request
  res: Response
  payload: AccessTokenPayload
}

@ObjectType()
class User {
  @Field(() => ID)
  id: ObjectId

  @Field()
  email: string

  constructor(user: UserType) {
    this.id = user._id
    this.email = user.email
  }
}

interface AccessTokenPayload {
  userId: ObjectId
  tokenVersion: number
  email: string
}

function createAccessToken(user: UserType): string {
  const payload: AccessTokenPayload = {
    userId: user._id,
    email: user.email,
    tokenVersion: user.login.tokenVersion
  }
  return sign(payload, jwt.secretKeyForAccess, { expiresIn: '15s' })
}

function createRefreshToken(user: UserType): string {
  const payload: AccessTokenPayload = {
    userId: user._id,
    tokenVersion: user.login.tokenVersion,
    email: user.email
  }

  return sign(payload, jwt.secretKeyForRefresh, { expiresIn: '7d' })
}

function installRefreshTokenCookie(refreshToken: string, res: Response) {
  res.cookie('rx', refreshToken, {
    httpOnly: true,
    path: '/refresh-token',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
}

// effectively logs out the user.
// See https://expressjs.com/en/api.html#res.clearCookie
function removeRefreshTokenCookie(res: Response) {
  res.clearCookie('rx', {
    httpOnly: true,
    path: '/refresh-token',
    secure: process.env.NODE_ENV === 'production'
  })
}

// respond with a new access token
async function exchangeToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.rx as string

    if (token) {
      let payload: AccessTokenPayload
      payload = verify(token, jwt.secretKeyForRefresh) as AccessTokenPayload

      if (payload) {
        const user = (
          await usersDao.findArray({ _id: new ObjectId(payload.userId) })
        )?.[0]

        if (user) {
          if (user.login.tokenVersion === payload.tokenVersion) {
            res.send({ ok: true, accessToken: createAccessToken(user) })
            return
          }
        }
      }
    }
    res.send({ ok: false, accessToken: '' })
  } catch (e) {
    console.error(e)
    res.send({ ok: false, accessToken: '' })
  }
}

const authenticateClient: MiddlewareFn<MyContext> = ({ context }, next) => {
  const { authentication } = context.req.headers

  if (!authentication) throw new Error('not authenticated')

  const token = (authentication as string).split(' ')[1]
  const payload = verify(
    token,
    jwt.secretKeyForAccess,
    {}
  ) as AccessTokenPayload

  context.payload = payload
  if (!payload?.userId) throw new Error('not completely verified')

  return next()
}

export {
  User,
  createAccessToken,
  createRefreshToken,
  installRefreshTokenCookie,
  removeRefreshTokenCookie,
  AccessTokenPayload,
  exchangeToken,
  authenticateClient
}

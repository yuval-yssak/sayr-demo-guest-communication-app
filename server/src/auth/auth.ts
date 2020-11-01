import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { jwt } from '../../config/config'
import { sign } from 'jsonwebtoken'

import { Request, Response } from 'express'
import 'reflect-metadata'
import { verify } from 'jsonwebtoken'
import usersDao, { UserType } from '../dao/usersDAO'

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

interface LoginPayload {
  userId: ObjectId
  tokenVersion: number
  email: string
}

function createAccessToken(user: UserType): string {
  const payload: LoginPayload = {
    userId: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion
  }
  return sign(payload, jwt.secretKeyForAccess, {
    expiresIn: '15s'
  })
}

function createRefreshToken(user: UserType): string {
  const payload: LoginPayload = {
    userId: user._id,
    tokenVersion: user.tokenVersion,
    email: user.email
  }
  return sign(payload, jwt.secretKeyForRefresh, {
    expiresIn: '7d'
  })
}

async function exchangeToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.rx as string
    console.log('in exchange token, ', token)
    if (token) {
      let payload: LoginPayload
      payload = verify(token, jwt.secretKeyForRefresh) as LoginPayload

      if (payload) {
        // console.log('payload, ', payload)
        const user = (
          await usersDao.findArray({ _id: new ObjectId(payload.userId) })
        )?.[0]

        if (user) {
          // console.log('user ', user)
          if (user.tokenVersion! === payload.tokenVersion) {
            const newExchangeToken = createRefreshToken(user)
            res.cookie('rx', newExchangeToken, {
              httpOnly: true,
              path: '/refresh-token',
              maxAge: 1000 * 60 * 60 * 24 * 7,
              secure: process.env.NODE_ENV === 'production'
            })

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
export {
  User,
  createAccessToken,
  createRefreshToken,
  LoginPayload,
  exchangeToken
}

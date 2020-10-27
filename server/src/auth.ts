import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectID } from 'mongodb'
import { jwt } from '../config/config'
import { sign } from 'jsonwebtoken'

import { Request, Response } from 'express'
import 'reflect-metadata'
import { verify } from 'jsonwebtoken'
import usersDao from './dao/usersDAO'

@ObjectType()
class UserType {
  _id: ObjectID

  @Field(() => ID)
  get id() {
    return this._id
  }

  @Field()
  email: string

  password: string

  tokenVersion: number
}

interface LoginPayload {
  userId: ObjectID
  tokenVersion: number
}

function createAccessToken(user: UserType): string {
  const payload: LoginPayload = {
    userId: user._id,
    tokenVersion: user.tokenVersion
  }
  return sign(payload, jwt.secretKeyForAccess, {
    expiresIn: '15s'
  })
}

function createRefreshToken(user: UserType): string {
  const payload: LoginPayload = {
    userId: user._id,
    tokenVersion: user.tokenVersion
  }
  return sign(payload, jwt.secretKeyForRefresh, {
    expiresIn: '7d'
  })
}

async function exchangeToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.rx as string

    if (token) {
      let payload: LoginPayload
      payload = verify(token, jwt.secretKeyForRefresh) as LoginPayload

      if (payload) {
        const user = (
          await usersDao.findArray({ _id: new ObjectID(payload.userId) })
        )?.[0]

        if (user) {
          if (user.tokenVersion! === payload.tokenVersion) {
            const newExchangeToken = createRefreshToken(user)
            res.cookie('rx', newExchangeToken, {
              httpOnly: true,
              path: '/refresh-token'
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
  UserType,
  createAccessToken,
  createRefreshToken,
  LoginPayload,
  exchangeToken
}

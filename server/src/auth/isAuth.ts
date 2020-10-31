import { verify } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../MyContext'
import { jwt } from '../../config/config'
import { LoginPayload } from './auth'

const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authentication = context.req.headers['authentication']

  if (!authentication) throw new Error('not authenticated')

  const token = (authentication as string).split(' ')[1]
  const payload = verify(token, jwt.secretKeyForAccess, {}) as LoginPayload

  context.payload = payload
  if (!payload?.userId) throw new Error('not completely verified')

  return next()
}

export { isAuth }

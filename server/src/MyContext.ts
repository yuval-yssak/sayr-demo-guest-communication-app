import { Request, Response } from 'express'
import { AccessTokenPayload } from './auth/auth'

export interface MyContext {
  req: Request
  res: Response
  payload: AccessTokenPayload
}

import { Request, Response } from 'express'
import { LoginPayload } from './auth/auth'

export interface MyContext {
  req: Request
  res: Response
  payload: LoginPayload
}

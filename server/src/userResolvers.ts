import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql'
import { compare, hash } from 'bcryptjs'
import usersDAO from './dao/usersDAO'
import { MyContext } from './MyContext'
import { UserType, createAccessToken, createRefreshToken } from './auth/auth'
import { isAuth } from './auth/isAuth'
import { ObjectId } from 'mongodb'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string

  @Field()
  user: UserType
}

@Resolver()
class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello world!!!!'
  }

  @Query(() => [UserType])
  async users() {
    return await usersDAO.findArray({})
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  tellASecret(@Ctx() { payload }: MyContext) {
    return `secret info..., your user id is ${payload.userId}`
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 10)
    const user: UserType = (await usersDAO.findArray({ email }))?.[0]

    try {
      if (user) {
        await usersDAO.updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { password: hashedPassword } }
        )
      } else {
        await usersDAO.insertOne({
          email,
          password: hashedPassword,
          tokenVersion: 0
        })
      }
    } catch (e) {
      console.error(e)
      return false
    }
    return true
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user: UserType | undefined = (
      await usersDAO.findArray({ email })
    )?.[0]

    if (!user) throw new Error('could not find user ' + email)

    let valid: boolean = false
    try {
      valid = await compare(password, user.password)
    } catch {}

    if (!valid) throw new Error('wrong password')

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    res.cookie('rx', refreshToken, {
      httpOnly: true,
      path: '/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production'
    })

    return { accessToken, user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Boolean {
    console.log('logging out')

    res.clearCookie('rx', {
      httpOnly: true,
      path: '/refresh-token',
      domain: 'http://localhost:3000',
      secure: process.env.NODE_ENV === 'production'
    })

    console.log('cookie cleared')
    return true
  }

  @Mutation(() => LoginResponse)
  async finishLoginWithGoogle(@Ctx() { req, res }: MyContext) {
    console.log('in server mutation, ', req.user, req.session)
    const user: UserType = req.session?.user

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    res.cookie('rx', refreshToken, {
      httpOnly: true,
      path: '/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production'
    })
    console.log('setting rx cookie ', refreshToken)
    // const user = req.session!.googleProfile

    return { accessToken, user }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => ID) userId: ObjectId) {
    console.log(arguments)
    await usersDAO.updateOne(
      { id: new ObjectId(userId) },
      { $inc: { accessToken: 1 as any } }
    )
    return true
  }
}
export { UserResolver, UserType }

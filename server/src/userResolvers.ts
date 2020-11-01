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
import usersDAO, { UserType } from './dao/usersDAO'
import { MyContext } from './MyContext'
import { User, createAccessToken, createRefreshToken } from './auth/auth'
import { isAuth } from './auth/isAuth'
import { ObjectId } from 'mongodb'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
class UserResolver {
  // get list of all users
  @Query(() => [User])
  async users() {
    const users = await usersDAO.findArray({})
    return users.map(user => new User(user))
  }

  // get only when authenticated
  @Query(() => String)
  @UseMiddleware(isAuth)
  tellASecret(@Ctx() { payload }: MyContext) {
    return `secret info..., your user id is ${payload.userId}`
  }

  // register new user by email and password
  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 10)
    const user = (await usersDAO.findArray({ email }))?.[0]

    try {
      if (user && !user.password) {
        // if the user registered with this email through OAuth,
        // the password is null. Set the new password.

        await usersDAO.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        )

        return true
      } else if (!user) {
        // create the new user record

        await usersDAO.insertOne({
          email,
          password: hashedPassword,
          tokenVersion: 0
        })

        return true
      }
      // In case the user exists already with a password, ignore.
      return false
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // The login process consists of the return value and an httpOnly cookie.
  // The LoginResponse return value has the access token and
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    // find user record by email
    const user = (await usersDAO.findArray({ email }))?.[0]

    if (!user) throw new Error('could not find user ' + email)

    let valid = false
    try {
      if (user.password) valid = await compare(password, user.password)
    } catch {}

    if (!valid) throw new Error('wrong password')

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    res.cookie('rx', refreshToken, {
      httpOnly: true,
      path: '/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production'
    })

    return { accessToken }
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
  async finishLoginWithGoogle(
    @Ctx() { req, res }: MyContext
  ): Promise<LoginResponse> {
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

    return { accessToken }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => ID) userId: ObjectId) {
    console.log(arguments)
    await usersDAO.updateOne(
      { id: new ObjectId(userId) },
      { $inc: { accessToken: 1 } }
    )
    return true
  }
}
export { UserResolver, UserType }

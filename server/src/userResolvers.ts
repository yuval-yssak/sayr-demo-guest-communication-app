import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql'
import { compare, hash } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import usersDAO, { UserType } from './dao/usersDAO'
import {
  User,
  createAccessToken,
  createRefreshToken,
  installRefreshTokenCookie,
  removeRefreshTokenCookie,
  authenticateClient,
  MyContext
} from './auth/auth'
import requestEmailVerification from './emailVerification'
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
  @UseMiddleware(authenticateClient)
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

    const requestID = new ObjectId()
    try {
      if (user && !user.password) {
        // if the user registered with this email through OAuth,
        // the password is null. Set the new password.
        await usersDAO.updateOne(
          { _id: user._id },
          {
            $set: {
              password: hashedPassword,
              emailVerification: {
                verified: false,
                requestExpiresOn: dayjs().add(2, 'day').toDate(),
                requestID
              }
            }
          }
        )
        requestEmailVerification(email, requestID)

        return true
      } else if (!user) {
        // create the new user record

        await usersDAO.insertOne({
          email,
          emailVerification: {
            verified: false,
            requestExpiresOn: dayjs().add(2, 'day').toDate(),
            requestID
          },
          password: hashedPassword,
          tokenVersion: 0
        })
        requestEmailVerification(email, requestID)

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
  // The return value has the short-lived access token and the cookie holds
  // the refresh token.
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
      if (user.emailVerification?.verified && user.password)
        valid = await compare(password, user.password)
    } catch {}

    if (!valid) throw new Error('wrong password')

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    installRefreshTokenCookie(refreshToken, res)
    return { accessToken }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Boolean {
    removeRefreshTokenCookie(res)
    return true
  }

  @Mutation(() => LoginResponse)
  async finishLoginWithGoogle(
    @Ctx() { req, res }: MyContext
  ): Promise<LoginResponse> {
    const user = req.session?.user as UserType

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)
    console.log('new refresh token is ', refreshToken)
    installRefreshTokenCookie(refreshToken, res)
    return { accessToken }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => String) userId: string
  ) {
    console.log(userId)
    const result = await usersDAO.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { tokenVersion: 1 } }
    )
    return result.modifiedCount === 1
  }
}
export { UserResolver, UserType }

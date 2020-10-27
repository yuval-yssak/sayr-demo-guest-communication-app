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
import { UserType, createAccessToken, createRefreshToken } from './auth'
import { isAuth } from './isAuth'
import { ObjectID } from 'mongodb'

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

    try {
      await usersDAO.insertOne({
        email,
        password: hashedPassword,
        tokenVersion: 0
      })
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

    const valid: boolean = await compare(password, user.password)
    if (!valid) throw new Error('wrong password')

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    res.cookie('rx', refreshToken, { httpOnly: true })

    return { accessToken, user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Boolean {
    res.clearCookie('rx')
    return true
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => ID) userId: ObjectID) {
    console.log(arguments)
    await usersDAO.updateOne(
      { _id: new ObjectID(userId) },
      { $inc: { tokenVersion: 1 } as any }
    )
    return true
  }
}
export { UserResolver, UserType }

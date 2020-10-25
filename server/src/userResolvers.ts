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
import usersDAO from './dao/usersDAO'
import { MyContext } from './MyContext'
import { UserType, createAccessToken, createRefreshToken } from './auth'
import { isAuth } from './isAuth'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello world!!!!'
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
      await usersDAO.insertOne({ email, password: hashedPassword })
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

    return { accessToken }
  }
}

export { UserResolver, UserType }

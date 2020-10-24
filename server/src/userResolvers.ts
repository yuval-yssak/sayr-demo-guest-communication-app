import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  ID
} from 'type-graphql'
import { compare, hash } from 'bcryptjs'
import { ObjectID } from 'mongodb'
import { sign } from 'jsonwebtoken'
import usersDAO from './dao/usersDAO'
import { jwt } from '../config/config'

@ObjectType()
class UserType {
  @Field(() => ID)
  _id: ObjectID

  @Field()
  email: string

  password: string
}

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
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    const user: UserType | undefined = (
      await usersDAO.findArray({ email })
    )?.[0]

    if (!user) throw new Error('could not find user ' + email)

    const valid: boolean = await compare(password, user.password)
    if (!valid) throw new Error('wrong password')

    const accessToken = sign({ userId: user._id }, jwt.secretKey, {
      expiresIn: '15m'
    })

    return { accessToken }
  }
}

export { UserResolver, UserType }

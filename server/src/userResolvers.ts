import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  ID
} from 'type-graphql'
import { hash } from 'bcryptjs'
import usersDAO from './dao/usersDAO'
import { ObjectID } from 'mongodb'

@ObjectType()
class User {
  @Field(() => ID)
  _id: ObjectID

  @Field()
  email: string

  password: string
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello world!!!!'
  }

  @Query(() => [User])
  async users() {
    return await usersDAO.findArray({})
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
}

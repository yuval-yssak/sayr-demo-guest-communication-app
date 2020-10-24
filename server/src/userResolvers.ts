import {
  Resolver,
  Query
  // , Mutation, Arg
} from 'type-graphql'

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello world!!!!'
  }

  // @Mutation()
  // register(@Arg('email') email: string, @Arg('password') password: string) {
  //   console.log(email, password)
  //   return
  // }
}

import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken: string
}

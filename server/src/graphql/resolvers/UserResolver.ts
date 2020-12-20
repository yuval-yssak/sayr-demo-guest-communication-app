import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  registerEnumType,
  InputType,
  Field,
  ObjectType
} from 'type-graphql'
import { compare, hash } from 'bcryptjs'
import { ObjectID, ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import UsersDAO, { IUser, PermissionLevel } from '../../dao/UsersDAO'
import {
  User,
  createAccessToken,
  createRefreshToken,
  installRefreshTokenCookie,
  removeRefreshTokenCookie,
  authenticateClient,
  MyContext
} from '../../auth/auth'
import requestEmailVerification from '../../emailVerification'
import LoginResponse from '../schema/LoginResponse'

@ObjectType()
class Invitation {
  @Field() timestamp: Date
  @Field(_type => String) staffPersonId: ObjectId

  constructor({
    timestamp,
    staffPersonId
  }: {
    timestamp: Date
    staffPersonId: ObjectId
  }) {
    this.timestamp = timestamp
    this.staffPersonId = staffPersonId
  }
}

@ObjectType()
export class NotificationSubscription {
  @Field() userAgent: string
  endpoint: string
  p256dhKey: string
  authKey: string

  constructor({
    userAgent,
    endpoint,
    p256dhKey,
    authKey
  }: {
    userAgent: string
    endpoint: string
    p256dhKey: string
    authKey: string
  }) {
    this.userAgent = userAgent
    this.endpoint = endpoint
    this.p256dhKey = p256dhKey
    this.authKey = authKey
  }
}

@ObjectType()
export class AppUser extends User {
  @Field(_type => PermissionLevel) permissionLevel: PermissionLevel
  @Field(() => [Invitation]) invitationsSent: Invitation[]
  @Field(() => [NotificationSubscription])
  subscriptions: NotificationSubscription[]
  @Field({ nullable: true }) profilePhoto?: string

  constructor(user: IUser) {
    super(user)
    console.log(user)
    this.permissionLevel = user.permissionLevel
    this.invitationsSent = user.invitationsSent.map(
      i => new Invitation({ timestamp: i.timestamp, staffPersonId: i.staff })
    )
    this.subscriptions = user.subscriptions.map(
      s =>
        new NotificationSubscription({
          userAgent: s.userAgent,
          endpoint: s.endpoint,
          p256dhKey: s.keys.p256dh,
          authKey: s.keys.auth
        })
    )
    this.profilePhoto = user.login.oauth?.google?.profile.photos?.[0].value

    console.log(this.subscriptions)
  }
}

@InputType()
export class PermissionLevelInput {
  @Field(_type => PermissionLevel)
  @Field()
  permissionLevel: PermissionLevel
}

registerEnumType(PermissionLevel, {
  name: 'PermissionLevel' // this one is mandatory
})

@Resolver()
class UserResolver {
  // get list of all users
  @Query(() => [AppUser])
  async users() {
    const users = await UsersDAO.findArray({})
    console.log('users', users)
    return users.map(user => new AppUser(user))
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
    const user = (await UsersDAO.findArray({ email }))?.[0]

    const requestID = new ObjectId()
    try {
      if (user && !user.login.password) {
        // if the user registered with this email through OAuth,
        // the password is null. Set the new password.
        await UsersDAO.updateOne(
          { _id: user._id },
          {
            $set: {
              login: {
                password: hashedPassword,
                emailVerification: {
                  verified: false,
                  requestExpiresOn: dayjs().add(2, 'day').toDate(),
                  requestID
                },
                tokenVersion: 0,
                oauth: user.login.oauth
              }
            }
          }
        )
        requestEmailVerification(email, requestID)

        return true
      } else if (!user) {
        // create the new user record

        const isThisFirstUser = (await UsersDAO.countDocuments()) === 0
        const permissionLevel = isThisFirstUser
          ? PermissionLevel.Admin
          : PermissionLevel.None

        await UsersDAO.insertOne({
          email,
          login: {
            emailVerification: {
              verified: false,
              requestExpiresOn: dayjs().add(2, 'day').toDate(),
              requestID
            },
            password: hashedPassword,
            tokenVersion: 0
          },
          invitationsSent: [],
          permissionLevel,
          subscriptions: []
        })

        await requestEmailVerification(email, requestID)
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
    const user = (await UsersDAO.findArray({ email }))?.[0]

    if (!user) throw new Error('could not find user ' + email)

    let valid = false
    try {
      if (user.login.emailVerification?.verified && user.login.password)
        valid = await compare(password, user.login.password)
    } catch {}

    if (!valid) throw new Error('wrong password')

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    installRefreshTokenCookie(refreshToken, res)
    return { accessToken }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): boolean {
    removeRefreshTokenCookie(res)
    return true
  }

  @Mutation(() => LoginResponse)
  async finishLoginWithGoogle(
    @Ctx() { req, res }: MyContext
  ): Promise<LoginResponse> {
    const user = req.session?.user as IUser
    if (!user) throw new Error('server session is empty')
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
    const result = await UsersDAO.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { tokenVersion: 1 } }
    )
    return result.modifiedCount === 1
  }

  @Mutation(() => Boolean)
  async updateUserPermission(
    @Arg('email') email: string,
    @Arg('permissionLevel', _type => PermissionLevel)
    permissionLevel: PermissionLevel
  ): Promise<boolean> {
    const result = await UsersDAO.updateOne(
      { email },
      { $set: { permissionLevel } }
    )
    return result.result.ok === 1
  }

  @Mutation(() => Boolean)
  async createUserSubscription(
    @Arg('userId') userId: string,
    @Arg('userAgent') userAgent: string,
    @Arg('endpoint') endpoint: string,
    @Arg('p256dhKey') p256dhKey: string,
    @Arg('authKey') authKey: string
  ): Promise<boolean> {
    const result = await UsersDAO.updateOne(
      { _id: new ObjectID(userId) },
      {
        $push: {
          subscriptions: {
            userAgent,
            endpoint,
            keys: {
              p256dh: p256dhKey,
              auth: authKey
            }
          }
        }
      }
    )
    return result.result.ok === 1
  }

  @Mutation(() => Boolean)
  async inviteUser(
    @Arg('email') email: string,
    @Arg('staff', _type => String) staffID: string
  ): Promise<boolean> {
    const [alreadyExists] = await UsersDAO.findArray({ email })
    if (alreadyExists) return false

    const result = await UsersDAO.insertOne({
      email,
      invitationsSent: [
        { staff: new ObjectId(staffID), timestamp: new Date() }
      ],
      permissionLevel: PermissionLevel.None,
      login: { password: null, tokenVersion: 1 },
      subscriptions: []
    })

    return result.result.ok === 1
  }
}

export { UserResolver, IUser }

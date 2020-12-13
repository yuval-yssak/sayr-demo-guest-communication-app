import CompoundRegistrationsDAO, {
  IRegistration
} from '../../dao/CompoundRegistrationsDAO'
import { Resolver, Query, Arg } from 'type-graphql'
import RegistrationResponse from '../schema/RegistrationResponse'
import * as compoundUtils from '../../services/compoundUtils'
import dayjs from 'dayjs'

function today() {
  return dayjs().format('YYYY-MM-DD')
}

@Resolver()
export class CompoundResolver {
  @Query(() => [RegistrationResponse])
  async guestsInHouse(): //Promise<void> {
  Promise<RegistrationResponse[]> {
    const compounds = await CompoundRegistrationsDAO.findArray({
      'persons.registrations': {
        $elemMatch: {
          status: { $ne: 'cancelled' },
          start_date: { $lte: today() },
          end_date: { $gte: today() },
          room: { $exists: true, $ne: '' }
        }
      }
    })

    const allRegs = compounds.reduce(
      (allRegs: IRegistration[], compound) =>
        allRegs.concat(compoundUtils.getAllRegistrations(compound)),
      []
    )
    return allRegs
      .filter(
        reg =>
          reg.status !== 'cancelled' &&
          reg.room !== '' &&
          reg.start_date <= today() &&
          reg.end_date >= today()
      )
      .map(reg => new RegistrationResponse(reg))
  }

  @Query(() => [RegistrationResponse])
  async upcomingArrivals(
    @Arg('inUpcomingDays', { defaultValue: 2 }) inUpcomingDays: number
  ): Promise<RegistrationResponse[]> {
    console.log('arrivals in upcoming ' + inUpcomingDays)
    const compounds = await CompoundRegistrationsDAO.findArray({
      'persons.registrations': {
        $elemMatch: {
          status: { $ne: 'cancelled' },
          start_date: {
            $gte: today(),
            $lte: dayjs().add(inUpcomingDays, 'day').format('YYYY-MM-DD')
          },
          room: { $exists: true, $ne: '' }
        }
      }
    })

    const allRegs = compounds.reduce(
      (allRegs: IRegistration[], compound) =>
        allRegs.concat(compoundUtils.getAllRegistrations(compound)),
      []
    )
    return allRegs
      .filter(
        reg =>
          reg.status !== 'cancelled' &&
          reg.room !== '' &&
          reg.start_date <=
            dayjs().add(inUpcomingDays, 'day').format('YYYY-MM-DD') &&
          reg.start_date >= today()
      )
      .map(reg => new RegistrationResponse(reg))
  }
}

// @Resolver()
// class UserResolver {
//   // get list of all users
//   @Query(() => [User])
//   async users() {
//     const users = await UsersDAO.findArray({})
//     return users.map(user => new User(user))
//   }

//   // get only when authenticated
//   @Query(() => String)
//   @UseMiddleware(authenticateClient)
//   tellASecret(@Ctx() { payload }: MyContext) {
//     return `secret info..., your user id is ${payload.userId}`
//   }

//   // register new user by email and password
//   @Mutation(() => Boolean)
//   async register(
//     @Arg('email') email: string,
//     @Arg('password') password: string
//   ) {
//     const hashedPassword = await hash(password, 10)
//     const user = (await UsersDAO.findArray({ email }))?.[0]

//     const requestID = new ObjectId()
//     try {
//       if (user && !user.login.password) {
//         // if the user registered with this email through OAuth,
//         // the password is null. Set the new password.
//         await UsersDAO.updateOne(
//           { _id: user._id },
//           {
//             $set: {
//               password: hashedPassword,
//               emailVerification: {
//                 verified: false,
//                 requestExpiresOn: dayjs().add(2, 'day').toDate(),
//                 requestID
//               }
//             }
//           }
//         )
//         requestEmailVerification(email, requestID)

//         return true
//       } else if (!user) {
//         // create the new user record

//         await UsersDAO.insertOne({
//           email,
//           login: {
//             emailVerification: {
//               verified: false,
//               requestExpiresOn: dayjs().add(2, 'day').toDate(),
//               requestID
//             },
//             password: hashedPassword,
//             tokenVersion: 0
//           },
//           invitationsSent: [],
//           permissionLevel: 'none',
//           personId: null /* TODO: if email matches - bring in the proper id */,
//           subscriptions: []
//         })
//         requestEmailVerification(email, requestID)

//         return true
//       }
//       // In case the user exists already with a password, ignore.
//       return false
//     } catch (e) {
//       console.error(e)
//       throw e
//     }
//   }

//   // The login process consists of the return value and an httpOnly cookie.
//   // The return value has the short-lived access token and the cookie holds
//   // the refresh token.
//   @Mutation(() => LoginResponse)
//   async login(
//     @Arg('email') email: string,
//     @Arg('password') password: string,
//     @Ctx() { res }: MyContext
//   ): Promise<LoginResponse> {
//     // find user record by email
//     const user = (await UsersDAO.findArray({ email }))?.[0]

//     if (!user) throw new Error('could not find user ' + email)

//     let valid = false
//     try {
//       if (user.login.emailVerification?.verified && user.login.password)
//         valid = await compare(password, user.login.password)
//     } catch {}

//     if (!valid) throw new Error('wrong password')

//     const accessToken = createAccessToken(user)
//     const refreshToken = createRefreshToken(user)

//     installRefreshTokenCookie(refreshToken, res)
//     return { accessToken }
//   }

//   @Mutation(() => Boolean)
//   logout(@Ctx() { res }: MyContext): boolean {
//     removeRefreshTokenCookie(res)
//     return true
//   }

//   @Mutation(() => LoginResponse)
//   async finishLoginWithGoogle(
//     @Ctx() { req, res }: MyContext
//   ): Promise<LoginResponse> {
//     const user = req.session?.user as IUser

//     const accessToken = createAccessToken(user)
//     const refreshToken = createRefreshToken(user)
//     console.log('new refresh token is ', refreshToken)
//     installRefreshTokenCookie(refreshToken, res)
//     return { accessToken }
//   }

//   @Mutation(() => Boolean)
//   async revokeRefreshTokensForUser(
//     @Arg('userId', () => String) userId: string
//   ) {
//     console.log(userId)
//     const result = await UsersDAO.updateOne(
//       { _id: new ObjectId(userId) },
//       { $inc: { tokenVersion: 1 } }
//     )
//     return result.modifiedCount === 1
//   }
// }

// export { UserResolver, IUser }

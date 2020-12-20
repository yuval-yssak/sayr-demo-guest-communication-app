import CompoundRegistrationsDAO, {
  IMatchedRegistration,
  IRegistration
} from '../../dao/CompoundRegistrationsDAO'
import { Resolver, Query, Arg, Int } from 'type-graphql'
import RegistrationResponse from '../schema/RegistrationResponse'
import * as compoundUtils from '../../services/compoundUtils'
import dayjs from 'dayjs'
import UsersDAO from '../../dao/UsersDAO'
import PersonsDAO from '../../dao/PersonsDAO'

function today() {
  return dayjs().format('YYYY-MM-DD')
}

@Resolver()
export class CompoundResolver {
  @Query(() => [RegistrationResponse])
  async guestsInHouse(): //Promise<void> {
  Promise<RegistrationResponse[]> {
    const inHouseQuery = {
      status: { $ne: 'cancelled' },
      start_date: { $lte: today() },
      end_date: { $gte: today() },
      room: { $exists: true, $ne: '' }
    }
    const compounds = await CompoundRegistrationsDAO.findArray({
      $or: [
        { 'persons.registrations': { $elemMatch: inHouseQuery } },
        { unmatchedRegistrations: { $elemMatch: inHouseQuery } }
      ]
    })
    const users = await UsersDAO.findArray({
      email: {
        $in: compounds.flatMap(
          c => c.persons?.flatMap(p => p.registrations.map(r => r.email)) || []
        )
      }
    })

    const persons = await PersonsDAO.findArray({
      id: {
        $in:
          (compounds.flatMap(c => c.persons?.map(p => p.id)) as number[]) || []
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
      .map(
        reg =>
          new RegistrationResponse({
            reg,
            person: persons.find(
              p => p.id === (reg as IMatchedRegistration)?.person_id
            ),
            user: users.find(u => u.email === reg.email)
          })
      )
  }

  @Query(() => [RegistrationResponse])
  async upcomingArrivals(
    @Arg('inUpcomingDays', _type => Int, { defaultValue: 2 })
    inUpcomingDays: number
  ): Promise<RegistrationResponse[]> {
    const query = {
      status: { $ne: 'cancelled' },
      start_date: {
        $gte: today(),
        $lte: dayjs().add(inUpcomingDays, 'day').format('YYYY-MM-DD')
      },
      room: { $exists: true, $ne: '' }
    }
    const compounds = await CompoundRegistrationsDAO.findArray({
      $or: [
        { 'persons.registrations': { $elemMatch: query } },
        { unmatchedRegistrations: { $elemMatch: query } }
      ]
    })

    const persons = await PersonsDAO.findArray({
      id: {
        $in:
          (compounds.flatMap(c => c.persons?.map(p => p.id)) as number[]) || []
      }
    })

    const users = await UsersDAO.findArray({
      email: {
        $in: compounds.flatMap(
          c => c.persons?.flatMap(p => p.registrations.map(r => r.email)) || []
        )
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
      .map(
        reg =>
          new RegistrationResponse({
            reg,
            person: persons.find(
              p => p.id === (reg as IMatchedRegistration)?.person_id
            ),
            user: users.find(u => u.email === reg.email)
          })
      )
  }
}

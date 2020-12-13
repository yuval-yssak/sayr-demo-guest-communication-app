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

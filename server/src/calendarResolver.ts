import { Resolver, Query, ObjectType, Field } from 'type-graphql'
import usersDAO from './dao/usersDAO'
import { UserType } from './auth/auth'
import axios from 'axios'
import { inspect } from 'util'

@ObjectType()
class Event {
  @Field()
  summary: string

  @Field()
  start: Date

  @Field()
  end: Date

  constructor(summary: string, start: Date, end: Date) {
    this.summary = summary
    this.start = start
    this.end = end
  }
}

@Resolver()
class CalendarResolver {
  @Query(() => [Event])
  async getEvents() {
    try {
      const Authorization =
        'Bearer ' +
        (await usersDAO.findArray({ email: 'iswara@sivananda.org' }))?.[0]
          ?.googleProfile?.accessToken
      console.log('auth token ', Authorization)
      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/iswara@sivananda.org/events',
        { headers: { Authorization } }
      )

      console.log()
      console.log()
      console.log()
      console.log(
        inspect(response.data, { depth: Infinity, maxArrayLength: 5 })
      )
      console.log()
      console.log()

      const events: Event[] = (<Array<any>>response.data.items)
        .filter(event => event.summary && event.start && event.end)
        // .filter((_, i) => i >= 18 && i < 25)
        .map(event => {
          console.log(
            event.summary,
            JSON.stringify(event.start),
            JSON.stringify(event.end)
          )
          return new Event(
            event.summary,
            new Date(event.start?.date || event.start?.dateTime),
            new Date(event.end?.date || event.end?.dateTime)
          )
        })
      return events
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
export { CalendarResolver, UserType }

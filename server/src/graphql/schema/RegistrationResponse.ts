import { ObjectID } from 'mongodb'
import {
  IItem,
  IMatchedRegistration,
  IPayment,
  IRegistration,
  IRegistrationStatus
} from '../../dao/CompoundRegistrationsDAO'
import { Field, ObjectType, ID, Int, Float } from 'type-graphql'
import { AppUser, IUser } from '../resolvers/UserResolver'
import { IPerson } from 'src/dao/PersonsDAO'

@ObjectType()
export default class RegistrationResponse implements IRegistration {
  @Field(_type => ID) id: number
  @Field() status: IRegistrationStatus
  @Field() submitted: string
  @Field() start_date: string
  @Field() end_date: string
  @Field() first_name: string
  @Field() last_name: string
  @Field() spiritual_name: string
  @Field() email: string
  @Field() program: string
  @Field(_type => Int) program_id: number
  @Field(_type => Int) room_id: number
  @Field(() => String, { nullable: true }) room: string | null
  @Field(_type => Int) lodging_id: number
  @Field(() => String, { nullable: true }) lodging: string | null
  @Field(_type => Float) total_items: number
  @Field(_type => Float) total_payments: number
  @Field(_type => Float) total_taxes: number
  @Field(_type => Float) grand_total: number
  @Field(_type => Float) balance_due: number
  @Field({ nullable: true }) headshotUrl?: string
  @Field(_type => Float) registration_total: number
  @Field(_type => Int, { nullable: true }) person_id: number
  @Field({ nullable: true }) userData?: AppUser
  questions: {
    [q: string]: string
  }
  payments?: IPayment[]
  items?: IItem[]

  _id: ObjectID

  constructor({
    reg,
    person,
    user
  }: {
    reg: IRegistration | IMatchedRegistration
    person?: IPerson
    user?: IUser
  }) {
    this.id = reg.id
    this.status = reg.status
    this.submitted = reg.submitted
    this.start_date = reg.start_date
    this.end_date = reg.end_date
    this.first_name = reg.first_name
    this.last_name = reg.last_name
    this.spiritual_name = reg.questions.spiritual_name || ''
    this.email = reg.email
    this.program = reg.program
    this.program_id = reg.program_id
    this.room_id = reg.room_id
    this.room = reg.room
    this.lodging_id = reg.lodging_id
    this.lodging = reg.lodging
    this.total_items = reg.total_items
    this.total_payments = reg.total_payments
    this.total_taxes = reg.total_taxes
    this.grand_total = reg.grand_total
    this.balance_due = reg.balance_due
    this.registration_total = reg.registration_total
    this.questions = reg.questions
    this.person_id = (reg as IMatchedRegistration).person_id
    this.headshotUrl = convertHeadshotUrl(person?.questions['headshot-url'])
    this.userData = user && new AppUser(user)
  }
}

function convertHeadshotUrl(url: string | undefined) {
  if (url === undefined) return
  if (/dropbox\.com/.test(url)) return url.replace(/dl=0/, 'raw=1')
  else return url
}

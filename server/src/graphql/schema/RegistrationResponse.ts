import { ObjectID } from 'mongodb'
import {
  IItem,
  IPayment,
  IRegistration,
  IRegistrationStatus
} from '../../dao/CompoundRegistrationsDAO'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export default class RegistrationResponse implements IRegistration {
  @Field() id: number
  @Field() status: IRegistrationStatus
  @Field() submitted: string
  @Field() start_date: string
  @Field() end_date: string
  @Field() first_name: string
  @Field() last_name: string
  @Field() email: string
  @Field() program: string
  @Field() program_id: number
  @Field() room_id: number
  @Field(() => String, { nullable: true }) room: string | null
  @Field() lodging_id: number
  @Field(() => String, { nullable: true }) lodging: string | null
  @Field() total_items: number
  @Field() total_payments: number
  @Field() total_taxes: number
  @Field() grand_total: number
  @Field() balance_due: number
  @Field() registration_total: number
  questions: {
    [q: string]: string
  }
  payments?: IPayment[]
  items?: IItem[]

  _id: ObjectID

  constructor(reg: IRegistration) {
    this.id = reg.id
    this.status = reg.status
    this.submitted = reg.submitted
    this.start_date = reg.start_date
    this.end_date = reg.end_date
    this.first_name = reg.first_name
    this.last_name = reg.last_name
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
  }
}

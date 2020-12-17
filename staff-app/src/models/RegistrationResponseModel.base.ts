/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * RegistrationResponseBase
 * auto generated base class for the model RegistrationResponseModel.
 */
export const RegistrationResponseModelBase = ModelBase.named(
  'RegistrationResponse'
)
  .props({
    __typename: types.optional(
      types.literal('RegistrationResponse'),
      'RegistrationResponse'
    ),
    id: types.union(types.undefined, types.number),
    status: types.union(types.undefined, types.string),
    submitted: types.union(types.undefined, types.string),
    start_date: types.union(types.undefined, types.string),
    end_date: types.union(types.undefined, types.string),
    first_name: types.union(types.undefined, types.string),
    last_name: types.union(types.undefined, types.string),
    email: types.union(types.undefined, types.string),
    program: types.union(types.undefined, types.string),
    program_id: types.union(types.undefined, types.number),
    room_id: types.union(types.undefined, types.number),
    room: types.union(types.undefined, types.null, types.string),
    lodging_id: types.union(types.undefined, types.number),
    lodging: types.union(types.undefined, types.null, types.string),
    total_items: types.union(types.undefined, types.number),
    total_payments: types.union(types.undefined, types.number),
    total_taxes: types.union(types.undefined, types.number),
    grand_total: types.union(types.undefined, types.number),
    balance_due: types.union(types.undefined, types.number),
    registration_total: types.union(types.undefined, types.number)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class RegistrationResponseModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get status() {
    return this.__attr(`status`)
  }
  get submitted() {
    return this.__attr(`submitted`)
  }
  get start_date() {
    return this.__attr(`start_date`)
  }
  get end_date() {
    return this.__attr(`end_date`)
  }
  get first_name() {
    return this.__attr(`first_name`)
  }
  get last_name() {
    return this.__attr(`last_name`)
  }
  get email() {
    return this.__attr(`email`)
  }
  get program() {
    return this.__attr(`program`)
  }
  get program_id() {
    return this.__attr(`program_id`)
  }
  get room_id() {
    return this.__attr(`room_id`)
  }
  get room() {
    return this.__attr(`room`)
  }
  get lodging_id() {
    return this.__attr(`lodging_id`)
  }
  get lodging() {
    return this.__attr(`lodging`)
  }
  get total_items() {
    return this.__attr(`total_items`)
  }
  get total_payments() {
    return this.__attr(`total_payments`)
  }
  get total_taxes() {
    return this.__attr(`total_taxes`)
  }
  get grand_total() {
    return this.__attr(`grand_total`)
  }
  get balance_due() {
    return this.__attr(`balance_due`)
  }
  get registration_total() {
    return this.__attr(`registration_total`)
  }
}
export function selectFromRegistrationResponse() {
  return new RegistrationResponseModelSelector()
}

export const registrationResponseModelPrimitives = selectFromRegistrationResponse()
  .status.submitted.start_date.end_date.first_name.last_name.email.program
  .program_id.room_id.room.lodging_id.lodging.total_items.total_payments
  .total_taxes.grand_total.balance_due.registration_total

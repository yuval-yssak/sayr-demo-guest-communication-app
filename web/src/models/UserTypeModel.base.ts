/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * UserTypeBase
 * auto generated base class for the model UserTypeModel.
 */
export const UserTypeModelBase = ModelBase.named('UserType')
  .props({
    __typename: types.optional(types.literal('UserType'), 'UserType'),
    id: types.identifier,
    email: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class UserTypeModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get email() {
    return this.__attr(`email`)
  }
}
export function selectFromUserType() {
  return new UserTypeModelSelector()
}

export const userTypeModelPrimitives = selectFromUserType().email

/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * LoginResponseBase
 * auto generated base class for the model LoginResponseModel.
 */
export const LoginResponseModelBase = ModelBase.named('LoginResponse')
  .props({
    __typename: types.optional(types.literal('LoginResponse'), 'LoginResponse'),
    accessToken: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LoginResponseModelSelector extends QueryBuilder {
  get accessToken() {
    return this.__attr(`accessToken`)
  }
}
export function selectFromLoginResponse() {
  return new LoginResponseModelSelector()
}

export const loginResponseModelPrimitives = selectFromLoginResponse()
  .accessToken

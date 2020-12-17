/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * DeviceBase
 * auto generated base class for the model DeviceModel.
 */
export const DeviceModelBase = ModelBase.named('Device')
  .props({
    __typename: types.optional(types.literal('Device'), 'Device'),
    endpoint: types.union(types.undefined, types.string),
    status: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DeviceModelSelector extends QueryBuilder {
  get endpoint() {
    return this.__attr(`endpoint`)
  }
  get status() {
    return this.__attr(`status`)
  }
}
export function selectFromDevice() {
  return new DeviceModelSelector()
}

export const deviceModelPrimitives = selectFromDevice().endpoint.status

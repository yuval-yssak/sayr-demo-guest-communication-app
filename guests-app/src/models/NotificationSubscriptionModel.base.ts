/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * NotificationSubscriptionBase
 * auto generated base class for the model NotificationSubscriptionModel.
 */
export const NotificationSubscriptionModelBase = ModelBase.named(
  'NotificationSubscription'
)
  .props({
    __typename: types.optional(
      types.literal('NotificationSubscription'),
      'NotificationSubscription'
    ),
    id: types.identifier,
    userAgent: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class NotificationSubscriptionModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get userAgent() {
    return this.__attr(`userAgent`)
  }
}
export function selectFromNotificationSubscription() {
  return new NotificationSubscriptionModelSelector()
}

export const notificationSubscriptionModelPrimitives = selectFromNotificationSubscription()
  .userAgent

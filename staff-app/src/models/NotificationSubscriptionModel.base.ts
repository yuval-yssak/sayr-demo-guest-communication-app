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
    userAgent: types.union(types.undefined, types.string),
    endpoint: types.union(types.undefined, types.string),
    p256dhKey: types.union(types.undefined, types.string),
    authKey: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class NotificationSubscriptionModelSelector extends QueryBuilder {
  get userAgent() {
    return this.__attr(`userAgent`)
  }
  get endpoint() {
    return this.__attr(`endpoint`)
  }
  get p256dhKey() {
    return this.__attr(`p256dhKey`)
  }
  get authKey() {
    return this.__attr(`authKey`)
  }
}
export function selectFromNotificationSubscription() {
  return new NotificationSubscriptionModelSelector()
}

export const notificationSubscriptionModelPrimitives = selectFromNotificationSubscription()
  .userAgent.endpoint.p256dhKey.authKey

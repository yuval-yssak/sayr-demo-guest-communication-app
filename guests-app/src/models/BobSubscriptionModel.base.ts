/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * BobSubscriptionBase
 * auto generated base class for the model BobSubscriptionModel.
 */
export const BobSubscriptionModelBase = ModelBase
  .named('BobSubscription')
  .props({
    __typename: types.optional(types.literal("BobSubscription"), "BobSubscription"),
    userAgent: types.union(types.undefined, types.string),
    endpoint: types.union(types.undefined, types.string),
    p256dhKey: types.union(types.undefined, types.string),
    authKey: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class BobSubscriptionModelSelector extends QueryBuilder {
  get userAgent() { return this.__attr(`userAgent`) }
  get endpoint() { return this.__attr(`endpoint`) }
  get p256dhKey() { return this.__attr(`p256dhKey`) }
  get authKey() { return this.__attr(`authKey`) }
}
export function selectFromBobSubscription() {
  return new BobSubscriptionModelSelector()
}

export const bobSubscriptionModelPrimitives = selectFromBobSubscription().userAgent.endpoint.p256dhKey.authKey

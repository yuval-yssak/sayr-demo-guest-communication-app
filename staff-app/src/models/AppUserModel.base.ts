/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { InvitationModel, InvitationModelType } from './InvitationModel'
import { InvitationModelSelector } from './InvitationModel.base'
import {
  NotificationSubscriptionModel,
  NotificationSubscriptionModelType
} from './NotificationSubscriptionModel'
import { NotificationSubscriptionModelSelector } from './NotificationSubscriptionModel.base'
import { RootStoreType } from './index'

/**
 * AppUserBase
 * auto generated base class for the model AppUserModel.
 */
export const AppUserModelBase = ModelBase.named('AppUser')
  .props({
    __typename: types.optional(types.literal('AppUser'), 'AppUser'),
    id: types.identifier,
    email: types.union(types.undefined, types.string),
    personId: types.union(types.undefined, types.null, types.integer),
    permissionLevel: types.union(types.undefined, types.string),
    invitationsSent: types.union(
      types.undefined,
      types.array(types.late((): any => InvitationModel))
    ),
    subscriptions: types.union(
      types.undefined,
      types.array(types.late((): any => NotificationSubscriptionModel))
    ),
    profilePhoto: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class AppUserModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get email() {
    return this.__attr(`email`)
  }
  get personId() {
    return this.__attr(`personId`)
  }
  get permissionLevel() {
    return this.__attr(`permissionLevel`)
  }
  get profilePhoto() {
    return this.__attr(`profilePhoto`)
  }
  invitationsSent(
    builder?:
      | string
      | InvitationModelSelector
      | ((selector: InvitationModelSelector) => InvitationModelSelector)
  ) {
    return this.__child(`invitationsSent`, InvitationModelSelector, builder)
  }
  subscriptions(
    builder?:
      | string
      | NotificationSubscriptionModelSelector
      | ((
          selector: NotificationSubscriptionModelSelector
        ) => NotificationSubscriptionModelSelector)
  ) {
    return this.__child(
      `subscriptions`,
      NotificationSubscriptionModelSelector,
      builder
    )
  }
}
export function selectFromAppUser() {
  return new AppUserModelSelector()
}

export const appUserModelPrimitives = selectFromAppUser().email.personId
  .permissionLevel.profilePhoto

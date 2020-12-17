/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import {
  AnnouncementResponseModel,
  AnnouncementResponseModelType
} from './AnnouncementResponseModel'
import { AnnouncementResponseModelSelector } from './AnnouncementResponseModel.base'
import { RecipientModel, RecipientModelType } from './RecipientModel'
import { RecipientModelSelector } from './RecipientModel.base'
import { RootStoreType } from './index'

/**
 * NotificationResponseBase
 * auto generated base class for the model NotificationResponseModel.
 */
export const NotificationResponseModelBase = ModelBase.named(
  'NotificationResponse'
)
  .props({
    __typename: types.optional(
      types.literal('NotificationResponse'),
      'NotificationResponse'
    ),
    _id: types.identifier,
    parentAnnouncement: types.union(
      types.undefined,
      types.late((): any => AnnouncementResponseModel)
    ),
    timestamp: types.union(types.undefined, types.frozen()),
    recipient: types.union(
      types.undefined,
      types.late((): any => RecipientModel)
    )
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class NotificationResponseModelSelector extends QueryBuilder {
  get _id() {
    return this.__attr(`_id`)
  }
  get timestamp() {
    return this.__attr(`timestamp`)
  }
  parentAnnouncement(
    builder?:
      | string
      | AnnouncementResponseModelSelector
      | ((
          selector: AnnouncementResponseModelSelector
        ) => AnnouncementResponseModelSelector)
  ) {
    return this.__child(
      `parentAnnouncement`,
      AnnouncementResponseModelSelector,
      builder
    )
  }
  recipient(
    builder?:
      | string
      | RecipientModelSelector
      | ((selector: RecipientModelSelector) => RecipientModelSelector)
  ) {
    return this.__child(`recipient`, RecipientModelSelector, builder)
  }
}
export function selectFromNotificationResponse() {
  return new NotificationResponseModelSelector()
}

export const notificationResponseModelPrimitives = selectFromNotificationResponse()
  ._id.timestamp

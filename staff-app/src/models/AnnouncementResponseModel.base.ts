/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * AnnouncementResponseBase
 * auto generated base class for the model AnnouncementResponseModel.
 */
export const AnnouncementResponseModelBase = ModelBase.named(
  'AnnouncementResponse'
)
  .props({
    __typename: types.optional(
      types.literal('AnnouncementResponse'),
      'AnnouncementResponse'
    ),
    id: types.identifier,
    subject: types.union(types.undefined, types.string),
    body: types.union(types.undefined, types.string),
    image: types.union(types.undefined, types.null, types.string),
    valid: types.union(types.undefined, types.boolean),
    created_at: types.union(types.undefined, types.frozen()),
    updated_at: types.union(types.undefined, types.frozen())
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class AnnouncementResponseModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get subject() {
    return this.__attr(`subject`)
  }
  get body() {
    return this.__attr(`body`)
  }
  get image() {
    return this.__attr(`image`)
  }
  get valid() {
    return this.__attr(`valid`)
  }
  get created_at() {
    return this.__attr(`created_at`)
  }
  get updated_at() {
    return this.__attr(`updated_at`)
  }
}
export function selectFromAnnouncementResponse() {
  return new AnnouncementResponseModelSelector()
}

export const announcementResponseModelPrimitives = selectFromAnnouncementResponse()
  .subject.body.image.valid.created_at.updated_at

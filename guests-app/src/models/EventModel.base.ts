/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * EventBase
 * auto generated base class for the model EventModel.
 */
export const EventModelBase = ModelBase.named('Event')
  .props({
    __typename: types.optional(types.literal('Event'), 'Event'),
    summary: types.union(types.undefined, types.string),
    start: types.union(types.undefined, types.frozen()),
    end: types.union(types.undefined, types.frozen())
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class EventModelSelector extends QueryBuilder {
  get summary() {
    return this.__attr(`summary`)
  }
  get start() {
    return this.__attr(`start`)
  }
  get end() {
    return this.__attr(`end`)
  }
}
export function selectFromEvent() {
  return new EventModelSelector()
}

export const eventModelPrimitives = selectFromEvent().summary.start.end

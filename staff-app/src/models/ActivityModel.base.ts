/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from 'mobx-state-tree'
import { QueryBuilder } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { RootStoreType } from './index'

/**
 * ActivityBase
 * auto generated base class for the model ActivityModel.
 */
export const ActivityModelBase = ModelBase.named('Activity')
  .props({
    __typename: types.optional(types.literal('Activity'), 'Activity'),
    id: types.identifier,
    from: types.union(types.undefined, types.string),
    to: types.union(types.undefined, types.string),
    name: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.string),
    location: types.union(types.undefined, types.string)
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class ActivityModelSelector extends QueryBuilder {
  get id() {
    return this.__attr(`id`)
  }
  get from() {
    return this.__attr(`from`)
  }
  get to() {
    return this.__attr(`to`)
  }
  get name() {
    return this.__attr(`name`)
  }
  get description() {
    return this.__attr(`description`)
  }
  get location() {
    return this.__attr(`location`)
  }
}
export function selectFromActivity() {
  return new ActivityModelSelector()
}

export const activityModelPrimitives = selectFromActivity().from.to.name
  .description.location

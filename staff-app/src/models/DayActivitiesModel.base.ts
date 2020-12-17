/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from 'mobx'
import { types } from 'mobx-state-tree'
import { MSTGQLRef, QueryBuilder, withTypedRefs } from 'mst-gql'
import { ModelBase } from './ModelBase'
import { ActivityModel, ActivityModelType } from './ActivityModel'
import { ActivityModelSelector } from './ActivityModel.base'
import { RootStoreType } from './index'

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  activities: IObservableArray<ActivityModelType>
}

/**
 * DayActivitiesBase
 * auto generated base class for the model DayActivitiesModel.
 */
export const DayActivitiesModelBase = withTypedRefs<Refs>()(
  ModelBase.named('DayActivities')
    .props({
      __typename: types.optional(
        types.literal('DayActivities'),
        'DayActivities'
      ),
      date: types.union(types.undefined, types.string),
      activities: types.union(
        types.undefined,
        types.array(MSTGQLRef(types.late((): any => ActivityModel)))
      )
    })
    .views(self => ({
      get store() {
        return self.__getStore<RootStoreType>()
      }
    }))
)

export class DayActivitiesModelSelector extends QueryBuilder {
  get date() {
    return this.__attr(`date`)
  }
  activities(
    builder?:
      | string
      | ActivityModelSelector
      | ((selector: ActivityModelSelector) => ActivityModelSelector)
  ) {
    return this.__child(`activities`, ActivityModelSelector, builder)
  }
}
export function selectFromDayActivities() {
  return new DayActivitiesModelSelector()
}

export const dayActivitiesModelPrimitives = selectFromDayActivities().date

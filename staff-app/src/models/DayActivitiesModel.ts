import { Instance } from 'mobx-state-tree'
import { DayActivitiesModelBase } from './DayActivitiesModel.base'

/* The TypeScript type of an instance of DayActivitiesModel */
export interface DayActivitiesModelType
  extends Instance<typeof DayActivitiesModel.Type> {}

/* A graphql query fragment builders for DayActivitiesModel */
export {
  selectFromDayActivities,
  dayActivitiesModelPrimitives,
  DayActivitiesModelSelector
} from './DayActivitiesModel.base'

/**
 * DayActivitiesModel
 */
export const DayActivitiesModel = DayActivitiesModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))

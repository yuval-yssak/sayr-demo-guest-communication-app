import { Instance } from 'mobx-state-tree'
import { ActivityModelBase } from './ActivityModel.base'

/* The TypeScript type of an instance of ActivityModel */
export interface ActivityModelType
  extends Instance<typeof ActivityModel.Type> {}

/* A graphql query fragment builders for ActivityModel */
export {
  selectFromActivity,
  activityModelPrimitives,
  ActivityModelSelector
} from './ActivityModel.base'

/**
 * ActivityModel
 */
export const ActivityModel = ActivityModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))

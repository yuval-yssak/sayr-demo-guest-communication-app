import { Instance } from 'mobx-state-tree'
import { EventModelBase } from './EventModel.base'

/* The TypeScript type of an instance of EventModel */
export interface EventModelType extends Instance<typeof EventModel.Type> {}

/* A graphql query fragment builders for EventModel */
export {
  selectFromEvent,
  eventModelPrimitives,
  EventModelSelector
} from './EventModel.base'

/**
 * EventModel
 */
export const EventModel = EventModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))

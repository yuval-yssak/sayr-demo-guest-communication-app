import { Instance } from 'mobx-state-tree'
import { NotificationResponseModelBase } from './NotificationResponseModel.base'

/* The TypeScript type of an instance of NotificationResponseModel */
export interface NotificationResponseModelType
  extends Instance<typeof NotificationResponseModel.Type> {}

/* A graphql query fragment builders for NotificationResponseModel */
export {
  selectFromNotificationResponse,
  notificationResponseModelPrimitives,
  NotificationResponseModelSelector
} from './NotificationResponseModel.base'

/**
 * NotificationResponseModel
 */
export const NotificationResponseModel = NotificationResponseModelBase.actions(
  self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  })
)

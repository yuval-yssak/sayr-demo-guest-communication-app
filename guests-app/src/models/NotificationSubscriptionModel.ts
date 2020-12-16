import { Instance } from "mobx-state-tree"
import { NotificationSubscriptionModelBase } from "./NotificationSubscriptionModel.base"

/* The TypeScript type of an instance of NotificationSubscriptionModel */
export interface NotificationSubscriptionModelType extends Instance<typeof NotificationSubscriptionModel.Type> {}

/* A graphql query fragment builders for NotificationSubscriptionModel */
export { selectFromNotificationSubscription, notificationSubscriptionModelPrimitives, NotificationSubscriptionModelSelector } from "./NotificationSubscriptionModel.base"

/**
 * NotificationSubscriptionModel
 */
export const NotificationSubscriptionModel = NotificationSubscriptionModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))

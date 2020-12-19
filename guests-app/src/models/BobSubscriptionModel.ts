import { Instance } from 'mobx-state-tree'
import { BobSubscriptionModelBase } from './BobSubscriptionModel.base'

/* The TypeScript type of an instance of BobSubscriptionModel */
export interface BobSubscriptionModelType
  extends Instance<typeof BobSubscriptionModel.Type> {}

/* A graphql query fragment builders for BobSubscriptionModel */
export {
  selectFromBobSubscription,
  bobSubscriptionModelPrimitives,
  BobSubscriptionModelSelector
} from './BobSubscriptionModel.base'

/**
 * BobSubscriptionModel
 */
export const BobSubscriptionModel = BobSubscriptionModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))

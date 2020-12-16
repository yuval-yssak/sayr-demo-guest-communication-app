import { Instance } from 'mobx-state-tree'
import { DeviceModelBase } from './DeviceModel.base'

/* The TypeScript type of an instance of DeviceModel */
export interface DeviceModelType extends Instance<typeof DeviceModel.Type> {}

/* A graphql query fragment builders for DeviceModel */
export {
  selectFromDevice,
  deviceModelPrimitives,
  DeviceModelSelector
} from './DeviceModel.base'

/**
 * DeviceModel
 */
export const DeviceModel = DeviceModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))

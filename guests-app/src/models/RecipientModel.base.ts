/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { DeviceModel, DeviceModelType } from "./DeviceModel"
import { DeviceModelSelector } from "./DeviceModel.base"
import { RootStoreType } from "./index"


/**
 * RecipientBase
 * auto generated base class for the model RecipientModel.
 */
export const RecipientModelBase = ModelBase
  .named('Recipient')
  .props({
    __typename: types.optional(types.literal("Recipient"), "Recipient"),
    id: types.union(types.undefined, types.number),
    devices: types.union(types.undefined, types.array(types.late((): any => DeviceModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class RecipientModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  devices(builder?: string | DeviceModelSelector | ((selector: DeviceModelSelector) => DeviceModelSelector)) { return this.__child(`devices`, DeviceModelSelector, builder) }
}
export function selectFromRecipient() {
  return new RecipientModelSelector()
}

export const recipientModelPrimitives = selectFromRecipient()

import { Instance } from 'mobx-state-tree'
import { RootStoreBase } from './RootStore.base'
import viewModel from './view'

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const RootStore = RootStoreBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
})).props({ view: viewModel })

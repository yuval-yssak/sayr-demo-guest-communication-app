import * as React from 'react'
import { StoreContext } from './reactUtils'
import { RootStoreType } from './RootStore'

export function useMst(): RootStoreType {
  const store = React.useContext(StoreContext)
  return store
}

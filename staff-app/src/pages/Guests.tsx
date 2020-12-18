import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../models/reactUtils'

function Guests() {
  const store = React.useContext(StoreContext)

  return (
    <>
      <div>Guests List</div>
      <ul>
        {Array.from(store.registrationResponses.values()).map(reg => (
          <li key={reg.id}>{reg.spiritual_name}</li>
        ))}
      </ul>
    </>
  )
}

export default observer(Guests)

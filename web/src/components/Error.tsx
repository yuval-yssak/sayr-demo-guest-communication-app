import React from 'react'
import { ClientError } from 'graphql-request/dist/src/types'

function Error({ error }: { error: ClientError }) {
  return (
    <>
      <p>Error</p>
      <pre>{error.response.errors?.map(e => e.message).join('\n\n')}</pre>
    </>
  )
}

export default Error

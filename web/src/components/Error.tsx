import React from 'react'
import { ClientError } from 'graphql-request/dist/src/types'

function Error({ error }: { error: Error }) {
  return (
    <>
      <p>Error</p>
      {(error as ClientError).response ? (
        <pre>
          {(error as ClientError).response.errors
            ?.map(e => e.message)
            .join('\n\n')}
        </pre>
      ) : (
        (error as Error).message
      )}
    </>
  )
}

export default Error

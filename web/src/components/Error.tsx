import React from 'react'
import { GraphQLResponse } from 'graphql-request/dist/src/types'

function Error({ error }: { error: any }) {
  return (
    <>
      <p>Error</p>
      {error?.response ? (
        <pre>
          {(error.response as GraphQLResponse)?.errors
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

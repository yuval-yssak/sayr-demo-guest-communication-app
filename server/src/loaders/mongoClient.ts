import { MongoClient } from 'mongodb'

import { mongoDBConfig } from '../../config/config'

async function connect() {
  const client = new MongoClient(mongoDBConfig.DBUrl, {
    useUnifiedTopology: true
  })
  await client.connect()

  // show connection string without its password
  console.log(
    'MongoDB: Connected successfully to server ',
    mongoDBConfig.DBUrl.replace(/\:\w+@/, '@') // remove password
  )

  return client
}

export { connect }

import {
  MongoClient,
  Collection,
  FilterQuery,
  CollectionInsertOneOptions,
  UpdateQuery,
  OptionalId
} from 'mongodb'

class abstractDAO<TSchema> {
  databaseName: string
  dbClient: MongoClient
  collection: Collection<TSchema>
  COLLECTION_NAME: string

  async init(client: MongoClient, dbName: string): Promise<void> {
    this.databaseName = dbName
    this.dbClient = client

    const existingCollections: Array<Collection> = await this.dbClient
      .db(dbName)
      .collections()

    const alreadyExisting: Collection | undefined = existingCollections.find(
      c => c.collectionName === this.COLLECTION_NAME
    )
    if (alreadyExisting) {
      this.collection = alreadyExisting
    } else {
      await this.dbClient.db(dbName).createCollection(this.COLLECTION_NAME)
      this.collection = client.db(dbName).collection(this.COLLECTION_NAME)
    }
  }

  async deleteAll() {
    if (!this.databaseName.match(/test/))
      /* c8 ignore next */
      throw new Error('delete all documents should only be used in test mode')
    await this.collection.deleteMany({})
  }

  async drop() {
    if (!this.databaseName.match(/test/))
      /* c8 ignore next */
      throw new Error(
        `drop ${this.COLLECTION_NAME} should only be used in test mode`
      )
    await this.collection.drop()
  }
  // this should only be used when the expected result can be contained in memory as one chunk
  async findArray(
    filter: FilterQuery<TSchema>,
    options = {}
  ): Promise<Array<TSchema>> {
    return await this.collection.find(filter, options).toArray()
  }

  async *findSequence(filter: FilterQuery<TSchema>, options = {}) {
    const cursor = this.collection.find(filter, options)

    while (await cursor.hasNext()) {
      yield await cursor.next()
    }
  }

  // this should only be used when the expected result can be contained in memory as one chunk
  async aggregateArray(pipeline: object[], options = {}) {
    return await this.collection.aggregate(pipeline, options).toArray()
  }

  async *aggregateSequence(pipeline: object[], options = {}) {
    const cursor = this.collection.aggregate(pipeline, options)

    while (await cursor.hasNext()) {
      yield await cursor.next()
    }
  }

  async upsert(
    filter: FilterQuery<TSchema>,
    newDocument: TSchema,
    options = {}
  ) {
    return await this.collection.replaceOne(filter, newDocument, {
      upsert: true,
      ...options
    })
  }

  async updateOne(filter: FilterQuery<TSchema>, update: UpdateQuery<TSchema>) {
    return await this.collection.updateOne(filter, update)
  }

  async insertOne(
    doc: OptionalId<TSchema>,
    options?: CollectionInsertOneOptions
  ) {
    return await this.collection.insertOne(doc, options)
  }

  initializeUnorderedBulkOp() {
    return this.collection.initializeUnorderedBulkOp()
  }
}

export default abstractDAO

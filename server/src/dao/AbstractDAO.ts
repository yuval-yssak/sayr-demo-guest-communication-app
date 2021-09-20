import {
  MongoClient,
  Collection,
  Filter,
  FindOptions,
  AggregateOptions,
  ReplaceOptions,
  InsertOneOptions,
  UpdateFilter,
  OptionalId
} from 'mongodb'

class AbstractDAO<S> {
  databaseName: string
  dbClient: MongoClient
  collection: Collection<S>
  COLLECTION_NAME: string

  async init(client: MongoClient, dbName: string): Promise<void> {
    this.databaseName = dbName
    this.dbClient = client

    const existingCollections: Collection[] = await this.dbClient
      .db(dbName)
      .collections()

    const alreadyExisting: Collection | undefined = existingCollections.find(
      c => c.collectionName === this.COLLECTION_NAME
    )
    if (!alreadyExisting) {
      await this.dbClient.db(dbName).createCollection(this.COLLECTION_NAME)
    }
    this.collection = client.db(dbName).collection<S>(this.COLLECTION_NAME)
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
  async findArray<T = S>(filter: Filter<S> = {}, options: FindOptions<S> = {}) {
    return await this.collection.find<T>(filter, options).toArray()
  }

  async *findSequence<T = S>(
    filter: Filter<S>,
    options: FindOptions<S> = {}
  ): AsyncGenerator<T> {
    const cursor = this.collection.find<T>(filter, options)

    while (await cursor.hasNext()) {
      yield await (cursor.next() as Promise<T>)
    }
  }

  // this should only be used when the expected result can be contained in memory as one chunk
  async aggregateArray<T = S>(
    pipeline: object[],
    options: AggregateOptions = {}
  ) {
    return await this.collection.aggregate<T>(pipeline, options).toArray()
  }

  async *aggregateSequence<T = S>(
    pipeline: object[],
    options: AggregateOptions = {}
  ): AsyncGenerator<T> {
    const cursor = this.collection.aggregate<T>(pipeline, options)

    while (await cursor.hasNext()) {
      yield await (cursor.next() as Promise<T>)
    }
  }

  async upsert(
    filter: Filter<S>,
    newDocument: S,
    options: ReplaceOptions = {}
  ) {
    return await this.collection.replaceOne(filter, newDocument, {
      ...options,
      upsert: true
    })
  }

  async updateOne(filter: Filter<S>, update: UpdateFilter<S>) {
    return await this.collection.updateOne(filter, update)
  }

  async insertOne(doc: OptionalId<S>, options?: InsertOneOptions) {
    return await this.collection.insertOne(doc, options || {})
  }

  async countDocuments() {
    return await this.collection.countDocuments()
  }

  initializeUnorderedBulkOp() {
    return this.collection.initializeUnorderedBulkOp()
  }
}

export default AbstractDAO

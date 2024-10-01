import type { Find, PayloadRequest, SanitizedCollectionConfig } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const find: Find = async function find(
  this: DrizzleAdapter,
  {
    collection,
    joins,
    limit,
    locale,
    page = 1,
    pagination,
    req = {} as PayloadRequest,
    sort: sortArg,
    where,
  },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const sort = typeof sortArg === 'string' ? sortArg : collectionConfig.defaultSort

  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  return findMany({
    adapter: this,
    fields: collectionConfig.fields,
    joins,
    limit,
    locale,
    page,
    pagination,
    req,
    sort,
    tableName,
    where,
  })
}
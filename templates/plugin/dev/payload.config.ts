import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { myPlugin } from 'plugin-package-name-placeholder'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { devUser } from './helpers/credentials.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'posts',
      fields: [],
    },
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: [
    myPlugin({
      collections: {
        posts: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
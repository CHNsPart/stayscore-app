import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const localUrl = process.env.DATABASE_URL
const syncUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!localUrl) throw new Error('DATABASE_URL is not defined')
if (!syncUrl) throw new Error('TURSO_DATABASE_URL is not defined')
if (!authToken) throw new Error('TURSO_AUTH_TOKEN is not defined')

// Create libSQL client with sync configuration
const libsql = createClient({
  url: process.env.NODE_ENV === 'production' ? syncUrl : localUrl,
  syncUrl: process.env.NODE_ENV === 'production' ? undefined : syncUrl,
  authToken: authToken
})

if (!global.prisma) {
  const adapter = new PrismaLibSQL(libsql)
  global.prisma = new PrismaClient({
    adapter: adapter
  })
}

const prisma = global.prisma

export async function syncDatabase() {
  if (!libsql) throw new Error('LibSQL client is not initialized')
  
  try {
    await libsql.sync()
    console.log('Database sync completed successfully')
  } catch (error) {
    console.error('Sync error:', error)
    throw error
  }
}

export { prisma }
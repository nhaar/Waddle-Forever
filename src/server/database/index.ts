import path from 'path'
import fs from 'fs'

import { Database } from 'sqlite3'

const databaseFolder = path.join(process.cwd(), 'database')
if (!fs.existsSync(databaseFolder)) {
  fs.mkdirSync(databaseFolder, {})
}

const db = new Database(path.join(databaseFolder, 'db.sqlite'))

db.run(`CREATE TABLE IF NOT EXISTS Penguin (
  id  INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  is_agent INTEGER,
  mascot INTEGER,
  color INTEGER,
  head INTEGER,
  face INTEGER,
  neck INTEGER,
  body INTEGER,
  hand INTEGER,
  feet INTEGER,
  flag INTEGER,
  background INTEGER,
  coins INTEGER,
  registration_date INTEGER,
  minutes_played INTEGER
)`)

export async function run (query: string, values: any[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    db.run(query, values, (err) => {
      if (err !== null) {
        reject(err)
      }
      resolve()
    })
  })
}

export async function get<T> (query: string, values: any[]): Promise<T[]> {
  return await new Promise<any>((resolve, reject) => {
    db.all<T>(query, values, (err, rows) => {
      if (err != null) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

export interface Penguin {
  id: number
  name: string
  is_agent: number
  mascot: number
  color: number
  head: number
  face: number
  neck: number
  body: number
  hand: number
  feet: number
  flag: number
  background: number
  coins: number
  registration_date: number
  minutes_played: number
}

export default db
// TODO proper minute incrementing

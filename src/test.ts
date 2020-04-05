import { Server } from 'http'
import express from 'express'
import fetch from 'node-fetch'

import { build, Client } from './index'

const host = 'localhost'
const port = 8888
const token = '123'


const methods = {
  watch: ['head'],
  read: ['get', 'options', 'trace'],
  write: ['delete', 'patch', 'post', 'put'],
}

const messages = {
  success: {
    message: "Hello world!"
  },
  failure: {
    message: "Invalid request"
  },
  missing: {
    message: 'endpoint not found'
  }
}

const app = express()
for (const m of methods.watch) {
  // @ts-ignore
  app[m]('/test', (req, res) => res.sendStatus(200))
  // @ts-ignore
  app[m]('/error', (req, res) => res.sendStatus(500))
}
for (const m of methods.read) {
  // @ts-ignore
  app[m]('/test', (req, res) => res.status(200).json(messages.success))
  // @ts-ignore
  app[m]('/error', (req, res) => res.status(500).json(messages.failure))
}
for (const m of methods.write) {
  // @ts-ignore
  app[m]('/test', (req, res) => res.status(200).json(messages.success))
  // @ts-ignore
  app[m]('/error', (req, res) => res.status(500).json(messages.failure))
}
app.use((req, res) => res.status(404).send(messages.missing))

let server: Server | null = null
let client: Client | null = null

beforeAll(() => {
  server = app.listen(port, () => console.log(`server started at http://${host}:${port}`))
  // @ts-ignore
  client = build({host, port, token, fetch})
})

afterAll(() => {
  server?.close()
})

for (const m of methods.watch) {
  describe(m, () => {
    // @ts-ignore
    test('success', () => expect(client[m]('test')).resolves.toEqual(200))
    // @ts-ignore
    test('failure', () => expect(client[m]('error')).resolves.toEqual(500))
    // @ts-ignore
    test('missing', () => expect(client[m]('null')).resolves.toEqual(404))
  })
}
for (const m of methods.read) {
  describe(m, () => {
    // @ts-ignore
    test('success', () => expect(client[m]('test')).resolves.toEqual(messages.success))
    // @ts-ignore
    test('failure', () => expect(client[m]('error')).rejects.toEqual(new Error(messages.failure.message)))
    // @ts-ignore
    test('missing', () => expect(client[m]('null')).rejects.toEqual(new Error(messages.missing.message)))
  })
}
for (const m of methods.write) {
  describe(m, () => {
    // @ts-ignore
    test('success', () => expect(client[m]('test')).resolves.toEqual(messages.success))
    // @ts-ignore
    test('failure', () => expect(client[m]('error')).rejects.toEqual(new Error(messages.failure.message)))
    // @ts-ignore
    test('missing', () => expect(client[m]('null')).rejects.toEqual(new Error(messages.missing.message)))
  })
}

export interface Options {
  host: string,
  port: number,
  token: string,
  secured?: boolean
  fetch?: typeof fetch
}

export interface Client {
  delete: Writer,
  get: Reader,
  head: Watcher,
  options: Reader,
  patch: Writer,
  post: Writer,
  put: Writer,
  trace: Reader
}

export type Watcher = (url: string) => Promise<number>
export type Reader = <T>(url: string) => Promise<T>
export type Writer = <T>(url: string, req: any) => Promise<T>

export function build (config: Readonly<Options>): Readonly<Client> {
  const headers = {
    'Authorization': `Bearer ${config.token}`,
    'Content-Type': 'application/json'
  }
  const protocol = config.secured ? 'https' : 'http'
  const address = `${protocol}://${config.host}:${config.port}`
  const fetcher = config.fetch || fetch

  return {
    delete: write('DELETE'),
    get: read('GET'),
    head: watch('HEAD'),
    options: read('OPTIONS'),
    patch: write('PATCH'),
    post: write('POST'),
    put: write('PUT'),
    trace: read('TRACE')
  }

  function watch(method: string): Watcher {
    return async function (url: string) {
      const target = `${address}/${url}`
      const options = { method, headers }
      return fetcher(target, options).then(res => res.status)
    }
  }

  function read(method: string): Reader {
    return async function <T>(url: string) {
      const target = `${address}/${url}`
      const options = { method, headers }
      return fetcher(target, options).then(validateResponse)
    }
  }

  function write(method: string): Writer {
    return async function <T>(url: string, req: any) {
      const target = `${address}/${url}`
      const body = JSON.stringify(req)
      const options = { method, body, headers }
      return fetcher(target, options).then(validateResponse)
    }
  }

  async function validateResponse (response: Response) {
    if (!response.ok) {
      const { message } = await response.json()
      throw new Error(message)
    }
    return response.json()
  }
}

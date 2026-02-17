// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
async function* logEach(store, stream) {
  for await (const m of stream) {
    store.response.message = m
    store.received_at = Date.now()
    store.id = Date.now()
    const msg = {
      type: '__GRPC_DEVTOOLS_EXTENSION__',
      data: store,
    }

    window.postMessage(msg)

    yield m
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const __GRPC_DEVTOOLS_EXTENSION__: any = () => (next) => async (request) => {
  const store = {
    id: Date.now(),
    name: request.url,
    stream: request.stream,
    sent_at: Date.now(),
    request: {
      // clone headers to avoid mutating
      header: Object.fromEntries(request.header.entries()),
      message: request.message,
    },
    response: {},
  }

  try {
    window.postMessage({
      type: '__GRPC_DEVTOOLS_EXTENSION__',
      data: store,
    })
  } catch (e) {
    console.log('devtools error', e)
  }

  try {
    const response = await next(request)

    store.received_at = Date.now()
    store.response.header = Object.fromEntries(response.header.entries())
    store.response.trailer = Object.fromEntries(response.trailer.entries())

    if (!request.stream) {
      store.response.message = response.message
      store.latency = store.received_at - store.sent_at
      const msg = {
        type: '__GRPC_DEVTOOLS_EXTENSION__',
        data: store,
      }

      try {
        window.postMessage(msg)
      } catch (e) {
        console.log('devtools error', e)
      }
    } else {
      const msg = {
        type: '__GRPC_DEVTOOLS_EXTENSION__',
        data: {
          ...store,
          stream: true,
        },
      }

      try {
        window.postMessage(msg)
      } catch (e) {
        console.log('devtools error', e)
      }

      return {
        ...response,
        message: logEach(store, response.message),
      }
    }

    return response
  } catch (e) {
    store.received_at = Date.now()
    store.response.trailer = {
      ['grpc-status']: e.code,
      ['grpc-message']: e.rawMessage,
    }
    store.response.message = e.rawMessage
    store.latency = store.received_at - store.sent_at
    const msg = {
      type: '__GRPC_DEVTOOLS_EXTENSION__',
      data: store,
    }

    try {
      window.postMessage(msg)
    } catch (e) {
      console.log('devtools error', e)
    }

    throw e
  }
}

window.dispatchEvent(new CustomEvent('grpc_devtools_loaded'))

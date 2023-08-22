async function* logEach(store, stream) {
  for await (const m of stream) {
    store.response.message = m
    store.received_at = Date.now()
    const msg = {
      type: '__GRPC_DEVTOOLS_EXTENSION__',
      data: store,
    }
    window.postMessage(msg)

    yield m;
  }
}

window.__GRPC_DEVTOOLS_EXTENSION__ = () => (next) => async (request) => {
  try {
    const store = {
      name: request.url,
      request: {},
      response: {},
    }
    store.request.header = Object.fromEntries(request.header.entries())

    store.sent_at = Date.now()
    const response = await next(request)
    store.received_at = Date.now()
    store.stream = response.stream
    store.response.header = Object.fromEntries(response.header.entries())
    store.response.trailer = Object.fromEntries(response.trailer.entries())

    if (!response.stream) {
      store.request.message = request.message
      store.response.message = response.message
      store.latency = store.received_at - store.sent_at
      const msg = {
        type: '__GRPC_DEVTOOLS_EXTENSION__',
        data: store,
      }
      window.postMessage(msg)
    } else {
      return {
        ...response,
        message: logEach(store, response.message),
      }
    }

    return response
  } catch (e) {
    console.log(e)
    throw e;
  }
}

window.dispatchEvent(new CustomEvent("grpc_devtools_loaded"));

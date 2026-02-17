
let port

const onMessage = (event) => {
  if (event.source != window) {
    return
  }

  if (event.data.type && event.data.type == "__GRPC_DEVTOOLS_EXTENSION__") {
    connect()

    if (port) {
      try {
        port.postMessage({
          action: "gRPCDebugger",
          target: "panel",
          data: event.data,
        });
      } catch (e) {
        port = null;
      }
    }
  }
}

const connect = () => {
  if (!port && chrome && chrome.runtime && chrome.runtime.connect) {
    try {
      port = chrome.runtime.connect(null, { name: "content" });
      port.postMessage({ action: "init" });
      port.onDisconnect.addListener(() => {
        port = null;
      });
    } catch (e) {
      port = null;
    }
  }
}

window.addEventListener("message", onMessage, false);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    port = null;
    connect();
  }
});

const script = document.createElement("script");
script.src = chrome.runtime.getURL("interceptor.js");
(document.head || document.documentElement).appendChild(script);

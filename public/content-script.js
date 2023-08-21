
let port

const onMessage = (event) => {
  if (event.source != window) {
    return
  }

  if (event.data.type && event.data.type == "__GRPC_DEVTOOLS_EXTENSION__") {
    connect()

    if (port) {
      port.postMessage({
        action: "gRPCDebugger",
        target: "panel",
        data: event.data,
      });
    }
  }
}

const connect = () => {
  if (!port && chrome && chrome.runtime) {
    port = chrome.runtime.connect(null, { name: "content" });
    port.postMessage({ action: "init" });
    port.onDisconnect.addListener(() => {
      port = null;
      window.removeEventListener("message", onMessage, false);
    });
  }
}

window.addEventListener("message", onMessage, false);

const script = document.createElement("script");
script.src = chrome.runtime.getURL("interceptor.js");
(document.head || document.documentElement).appendChild(script);

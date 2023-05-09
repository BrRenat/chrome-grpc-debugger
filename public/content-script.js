const script = document.createElement("script");
script.src = chrome.runtime.getURL("interceptor.js");
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

window.dispatchEvent(new CustomEvent("grpc_devtools_loaded"));

let port = chrome.runtime.connect(null, { name: "content" });

const onMessage = (event) => {
  if (event.source != window) {
    return
  }

  if (event.data.type && event.data.type == "__GRPC_DEVTOOLS_EXTENSION__") {
    if (port) {
      port.postMessage({
        action: "gRPCDebugger",
        target: "panel",
        data: event.data,
      });
    }
  }
}

port.postMessage({ action: "init" });
port.onDisconnect.addListener(() => {
  port = undefined;
  window.removeEventListener("message", onMessage, false);
});
window.addEventListener("message", onMessage, false);

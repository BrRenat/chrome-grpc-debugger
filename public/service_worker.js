let connections = {};

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== "content" && port.name !== "panel") {
    return;
  }

  const extensionListener = message => {
    const tabId = message.tabId || port.sender?.tab?.id;

    if (!tabId) {
      return;
    }

    if (message.action == "init") {
      if (!connections[tabId]) {
        connections[tabId] = {};
      }
      connections[tabId][port.name] = port;
      return;
    }

    if (message.target) {
      const conn = connections[tabId]?.[message.target];

      if (conn) {
        try {
          conn.postMessage(message);
        } catch (e) {
          delete connections[tabId][message.target];
        }
      }
    }
  };

  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener((disconnectedPort) => {
    disconnectedPort.onMessage.removeListener(extensionListener);

    for (const tab of Object.keys(connections)) {
      const tabConns = connections[tab];
      for (const key of Object.keys(tabConns)) {
        if (tabConns[key] === disconnectedPort) {
          delete tabConns[key];
        }
      }
      if (Object.keys(connections[tab]).length === 0) {
        delete connections[tab];
      }
    }
  });
});

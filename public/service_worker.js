let connections = {};

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== "content" && port.name !== "panel") {
    return;
  }

  const extensionListener = message => {
    const tabId = message.tabId || port.sender.tab.id;

    if (message.action == "init") {
      if (!connections[tabId]) {
        connections[tabId] = {};
      }
      connections[tabId][port.name] = port;
      return;
    }

    if (message.target) {
      const conn = connections[tabId][message.target];

      if (conn) {
        conn.postMessage(message);
      }
    }
  };

  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(extensionListener);

    for (const tab of Object.keys(connections)) {
      if (connections[tab] === port) {
        delete connections[tab]

        break;
      }
    }
  });
});

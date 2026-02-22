const host =
  window.location.port === "4321" ? "127.0.0.1:58270" : window.location.host;

let wsInternal: WebSocket | null = null;

const remoteListeners: Map<string, (msgEvent: MessageEvent) => void> = new Map();
const msgQueue: Array<Record<string, any>> = [];
const onConnectQueue: Array<() => void> = [];
const onResync: Array<() => void> = [];
let connectAttempts = 0;

function connect() {
  if (wsInternal) {
    return;
  }
  wsInternal = new WebSocket(`ws://${host}/ws`);
  function onDisconnect() {
    wsInternal = null;
    setTimeout(
      connect,
      Math.min(
        500 * 2 ** connectAttempts++ + (Math.random() * 200 - 100),
        10000,
      ),
    );
  }
  wsInternal.addEventListener("error", onDisconnect);
  wsInternal.addEventListener("close", onDisconnect);
  wsInternal.addEventListener("open", () => {
    if (!wsInternal) {
      return;
    }
    connectAttempts = 0;
    for (const handler of remoteListeners.values()) {
      wsInternal.addEventListener("message", handler);
    }
    for (const func of onResync) {
      func();
    }
    while (onConnectQueue.length > 0) {
      const func = onConnectQueue.shift();
      if (func) {
        func();
      }
    }
    while (msgQueue.length > 0) {
      const msg = msgQueue.shift();
      if (msg) {
        wsInternal.send(JSON.stringify(msg));
      }
    }
  });
}

connect();

function onConnect(func: () => void) {
  if (wsInternal?.readyState === WebSocket.OPEN) {
    func();
  } else {
    onConnectQueue.push(func);
  }
}

async function getWs(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    onConnect(() => {
      if (!wsInternal) {
        reject(new Error("Failed to connect to WebSocket server during open!!"));
        return;
      }
      resolve(wsInternal);
    });
  });
}

function sendMessage(message: Record<string, any>) {
  if (wsInternal?.readyState === WebSocket.OPEN) {
    wsInternal.send(JSON.stringify(message));
  } else {
    msgQueue.push(message);
  }
}

let rpcCounter = 1;

function runRpcInner(
  rpcId: number,
  method: string,
  params: string | null = null,
  needsResync = false,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    getWs().then((ws) => {
      const listener = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.i === rpcId) {
          ws.removeEventListener("message", listener);
          resolve(data.r ?? null);
        }
      };
      ws.addEventListener("message", listener);
      if (params === null) {
        sendMessage({ i: rpcId, m: method });
      } else {
        sendMessage({ i: rpcId, m: method, p: params });
      }
      if (needsResync) {
        onResync.push(() => {
          runRpcInner(rpcId, method, params);
        });
      }
    });
  });
}

export function runRpc(
  method: string,
  params: string | null = null,
  needsResync = false,
): Promise<string | null> {
  return runRpcInner(rpcCounter++, method, params, needsResync);
}

export function disconnect() {
  runRpcInner(0, "disconnect").then(() => {
    wsInternal?.close();
  });
}

export function listenRemote(
  event: string,
  callback: (data: string | undefined) => void,
) {
  const handler = (msgEvent: MessageEvent) => {
    const data = JSON.parse(msgEvent.data);
    if (data.e === event) {
      callback(data.d);
    }
  };
  const uid = crypto.randomUUID();
  remoteListeners.set(uid, handler);
  wsInternal?.addEventListener("message", handler);
  return uid;
}

export function unlistenRemote(uid: string) {
  const handler = remoteListeners.get(uid);
  if (handler) {
    wsInternal?.removeEventListener("message", handler);
    remoteListeners.delete(uid);
  }
}

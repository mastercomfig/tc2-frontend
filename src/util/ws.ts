const host =
  window.location.port === "4321" ? "127.0.0.1:58270" : window.location.host;

const ws = new WebSocket(`ws://${host}/ws`);

const msgQueue: Array<Record<string, any>> = [];

ws.addEventListener("open", () => {
  while (msgQueue.length > 0) {
    const msg = msgQueue.shift();
    if (msg) {
      ws.send(JSON.stringify(msg));
    }
  }
});

function sendMessage(message: Record<string, any>) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    msgQueue.push(message);
  }
}

let rpcCounter = 1;

function runRpcInner(
  rpcId: number,
  method: string,
  params: string | null = null,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
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
  });
}

export function runRpc(
  method: string,
  params: string | null = null,
): Promise<string | null> {
  return runRpcInner(rpcCounter++, method, params);
}

export function disconnect() {
  runRpcInner(0, "disconnect").then(() => {
    ws.close();
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
  ws.addEventListener("message", handler);
  return handler;
}

export function unlistenRemote(handler: (msgEvent: MessageEvent) => void) {
  ws.removeEventListener("message", handler);
}

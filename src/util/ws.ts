const ws = new WebSocket(`ws://${window.location.host}/ws`);

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

let rpcCounter = 0;

export function runRpc(
  method: string,
  params: string | null = null,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const rpcId = rpcCounter++;
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

export function Do(command: string) {
    if (window.location.protocol.startsWith("http")) return;
    window.location.assign("do:" + command);
}

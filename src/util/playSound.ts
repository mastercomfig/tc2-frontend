import { runRpc } from "./ws";

export function playSound(sound: string) {
    runRpc("playsound", sound);
}

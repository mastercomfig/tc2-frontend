import { Do } from "./do";

export function playSound(sound: string) {
    Do("playsound?" + sound);
}

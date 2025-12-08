import { disconnect, runRpc } from "@/util/ws"

import useSettingsStore, { ViewModeState } from "@/store/settings";

export function SettingsButton({ setting }) {
    const settingsStore = useSettingsStore((state) => state);

    const onClick = () => {
        if (setting.cvar === "videomode") {
            const width = settingsStore.pending.width || settingsStore.current.width;
            const height = settingsStore.pending.height || settingsStore.current.height;
            const windowmode = settingsStore.pending.windowmode >= 0 ? settingsStore.pending.windowmode : settingsStore.current.windowmode;
            const borderless = settingsStore.pending.borderless >= 0 ? settingsStore.pending.borderless : settingsStore.current.borderless;
            runRpc("cmd", `mat_setvideomode ${width} ${height} ${windowmode} ${borderless}`);
            runRpc("cmd", "mat_savechanges");
            runRpc("cmd", "host_writeconfig");
            // we're about to get reset, so we need to disconnect
            disconnect();
            settingsStore.setPendingMode(new ViewModeState(-1, -1, 0, 0));
            return;
        }
        if (setting.cvar.startsWith("engine ")) {
            runRpc("cmd", setting.cvar.substring(7));
            return;
        }
        if (setting.cvar.startsWith("mm ")) {
            runRpc("uicmd", setting.cvar.substring(3));
            return;
        }
        runRpc("uicmd", setting.cvar);
    }

    return (
        <div>
            <button onClick={onClick} className="px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700 tf2-light text-lg">
                {setting.label}
            </button>
        </div>
    )
}

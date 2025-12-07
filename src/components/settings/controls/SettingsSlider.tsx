import { runRpc } from "@/util/ws";
import { useCallback, useEffect, useState } from "react";

export function SettingsSlider({ setting }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    runRpc("getcvar", setting.cvar).then((response) => {
      if (response !== null && response.length > 0) {
        setValue(parseFloat(response));
      }
    });
  }, []);

  const callback = (val: string) => {
    runRpc("setcvar", `${setting.cvar} ${val}`);
    setValue(parseFloat(val));
  };

  return (
    <div>
      <label className="mb-2 text-white tf2-light text-xl">
        {setting.label}
      </label>
      <div className="flex flex-row justify-between items-center w-2/5">
        <input
          className="me-4 flex-1"
          type="range"
          value={value}
          onChange={(ev) => {
            callback(ev.target.value)
          }}
          min={setting.min ?? 0}
          max={setting.max ?? 100}
          step={setting.step ?? 1}
        />
        <input
          className="mb-2 p-2 text-white bg-stone-800 border border-gray-300 w-20"
          type="number"
          value={value}
          onChange={(ev) => {
            callback(ev.target.value)
          }}
          min={setting.min ?? 0}
          max={setting.max ?? 100}
          step={setting.step ?? 1}
        />
      </div>
    </div>
  );
}

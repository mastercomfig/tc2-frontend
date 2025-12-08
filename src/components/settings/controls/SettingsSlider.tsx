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
      <div className="flex flex-row justify-between items-center w-3/5">
        <input
          className="me-4 flex-1 accent-stone-600 hover:accent-stone-500 focus:accent-stone-700 dark:accent-stone-400 dark:hover:accent-stone-300 dark:focus:accent-stone-500 bg-stone-800 border border-gray-300"
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
          className="mb-2 p-2 text-white bg-stone-800 border border-gray-300 w-20 tf2-light"
          type="number"
          value={value}
          disabled={true}
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

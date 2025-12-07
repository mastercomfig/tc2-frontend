import { runRpc } from "@/util/ws";
import { useEffect, useState } from "react";

export function SettingsSelect({ setting }) {
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
    setValue(parseInt(val));
  };

  return (
    <div>
      <label className="block mb-2 text-white tf2-light text-xl">
        {setting.label}
      </label>
      <select className="px-4 py-2 mb-2 border text-white" value={value} onChange={(ev) => callback(ev.target.value)}>
        {setting.options.map((option) => (
          <option key={option.value} value={option.value} selected={option.value === value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

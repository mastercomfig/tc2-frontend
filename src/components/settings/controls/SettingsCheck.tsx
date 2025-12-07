import { runRpc } from "@/util/ws";
import { useEffect, useState } from "react";

export function SettingsCheck({ setting }) {
  const [value, setValue] = useState(false);
  const [floatValue, setFloatValue] = useState(0.0);

  useEffect(() => {
    runRpc("getcvar", setting.cvar).then((response) => {
      if (response !== null && response.length > 0) {
        if (setting.mode === "negate") {
          const floatVal = parseFloat(response);
          setValue(floatVal < 0.0);
          setFloatValue(floatVal);
        } else if (setting.mode === "flip") {
          setValue(response === "0");
        } else {
          setValue(response !== "0");
        }
      }
    });
  }, []);

  const callback = (val: boolean) => {
    if (setting.mode === "negate") {
      const f = val ? -Math.abs(floatValue) : Math.abs(floatValue);
      runRpc("setcvar", `${setting.cvar} ${f}`);
    } else if (setting.mode === "flip") {
      const b = val ? "0" : "1";
      runRpc("setcvar", `${setting.cvar} ${b}`);
    } else {
      const b = val ? "1" : "0";
      runRpc("setcvar", `${setting.cvar} ${b}`);
    }
    setValue(val);
  };

  return (
    <div className="flex gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-8 grid-cols-1">
          <input
            id={setting.cvar}
            checked={value}
            onChange={(ev) => {
              callback(ev.target.checked);
            }}
            type="checkbox"
            className="col-start-1 row-start-1 appearance-none border border-gray-300 bg-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 checked:border-stone-400 checked:bg-stone-400 indeterminate:border-stone-400 indeterminate:bg-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:border-gray-300 forced-colors:appearance-auto"
          />
          <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-checked:opacity-100"
            />
            <path
              d="M3 7H11"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-indeterminate:opacity-100"
            />
          </svg>
        </div>
      </div>
      <div className="text-xl">
        <label
          className="font-medium text-white tf2-light"
          htmlFor={setting.cvar}
        >
          {setting.label}
        </label>
      </div>
    </div>
  );
}

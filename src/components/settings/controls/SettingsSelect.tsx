import { runRpc } from "@/util/ws";
import { use, useEffect, useMemo, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import useSettingsStore from "@/store/settings";

export function SettingsSelect({ setting }) {
  const [value, setValue] = useState("0");

  const settingsStore = useSettingsStore((state) => state);

  const options = useMemo(() => {
    if (setting.cvar === "videomode_size") {
      return settingsStore.availableViewModes.map((mode, index) => {
        const label = `${mode.width}x${mode.height} ${mode.recommended ? " (Recommended)" : ""}`;
        return {
          label: label,
          value: index.toString()
        };
      });
    }
    return setting.options;
  }, [settingsStore.availableViewModes, setting.cvar, setting.options]);

  const selectedOption = useMemo(() => {
    if (setting.cvar === "videomode_size") {
    }
    return options.find((o) => o.value === value);
  }, [value, options]);

  // Initial load of current value for special cvars
  useEffect(() => {
    if (setting.cvar === "videomode_size") {
      const bHasPending = settingsStore.pending.width > 0 && settingsStore.pending.height > 0;
      if (bHasPending) {
        return;
      }
      const idx = settingsStore.availableViewModes.findIndex((mode =>
        mode.width === settingsStore.current.width &&
        mode.height === settingsStore.current.height
      ));
      setValue(idx.toString());
    } else if (setting.cvar === "videomode_mode") {
      const bHasPending = settingsStore.pending.windowmode >= 0 && settingsStore.pending.borderless >= 0;
      if (bHasPending) {
        return;
      }
      const idx = settingsStore.current.windowmode === 0 ? 0 : (settingsStore.current.borderless === 0 ? 1 : 2)
      setValue(idx.toString());
    }
  }, [settingsStore.current, settingsStore.availableViewModes]);

  // Initial load of current value for normal cvars
  useEffect(() => {
    if (setting.cvar === "videomode_mode") {
      return;
    }
    if (setting.cvar === "videomode_size") {
      return;
    }
    runRpc("getcvar", setting.cvar).then((response) => {
      const bNullOkay = setting.cvar === "cl_crosshair_file";
      const bNull = response === null || response.length === 0;
      if (bNull) {
        if (bNullOkay) {
          response = "";
        } else {
          return;
        }
      }
      if (response !== null) {
        setValue(response);
      }
    });
  }, []);

  const onChange = (val: string) => {
    if (setting.cvar === "videomode_mode") {
      const iVal = parseInt(val);
      settingsStore.setPendingModeField("windowmode", iVal === 0 ? 0 : 1);
      settingsStore.setPendingModeField("borderless", iVal === 2 ? 1 : 0);
    } else if (setting.cvar === "videomode_size") {
      const iVal = parseInt(val);
      settingsStore.setPendingModeField("width", settingsStore.availableViewModes[iVal].width);
      settingsStore.setPendingModeField("height", settingsStore.availableViewModes[iVal].height);
    } else {
      runRpc("setcvar", `${setting.cvar} ${val}`);
    }
    setValue(val);
  };

  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <Label className="block mb-2 text-white tf2-light text-xl">
          {setting.label}
        </Label>
        <div className="relative mt-2">
          <div className="inline-flex divide-x divide-stone-700 outline-hidden dark:divide-stone-600">
            <ListboxButton className="cursor-default inline-flex items-center gap-x-4 bg-stone-600 px-3 py-2 text-white dark:bg-stone-500 hover:bg-stone-700 focus-visible:outline-1 focus-visible:outline-stone-400 dark:bg-stone-500 dark:hover:bg-stone-400 dark:focus-visible:outline-stone-400">
              <p className="text-lg tf2-light font-semibold">
                {selectedOption?.label ?? "\u00A0"}
              </p>
              <ChevronDownIcon aria-hidden="true" className="size-5 text-white forced-colors:text-[Highlight]" />
            </ListboxButton>
          </div>

          <ListboxOptions
            transition
            className="tf2-light absolute mt-1 max-h-76 z-10 mt-2 origin-top-right divide-y divide-gray-200 overflow-y-auto overflow-x-hidden bg-white shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 dark:divide-white/10 dark:bg-stone-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="group cursor-default p-4 text-lg text-gray-900 select-none data-focus:bg-stone-600 data-focus:text-white dark:text-white dark:data-focus:bg-stone-500"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <p className="font-normal group-data-selected:font-semibold">
                      {option.label}
                    </p>
                  </div>
                  {option.tooltip && (
                    <p className="mt-2 text-gray-500 group-data-focus:text-stone-200 dark:text-gray-400 dark:group-data-focus:text-stone-100">
                      {option.tooltip}
                    </p>
                  )}
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}

import { runRpc } from "@/util/ws";
import { useEffect, useMemo, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function SettingsSelect({ setting }) {
  const [value, setValue] = useState(0);

  const selectedOption = useMemo(() => {
    return setting.options.find((o) => o.value === value.toString());
  }, [value, setting.options]);

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
      <Listbox value={value.toString()} onChange={callback}>
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
            {setting.options.map((option) => (
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

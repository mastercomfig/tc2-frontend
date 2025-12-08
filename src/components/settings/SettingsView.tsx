import settings from "@/data/settings.json";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import "./SettingsView.css"
import { SettingsCategory } from "./SettingsCategory";
import { SettingsSearch } from "./SettingsSearch";
import { runRpc } from "@/util/ws";
import useSettingsStore, { parseViewModes, ViewModeState } from "@/store/settings";

type SettingsData = typeof settings;
const settingsData = settings as SettingsData;
const tabs = settingsData.categories.map((category) => category.name);

function classNames(...classes: string[]) {
  return classes.join(" ");
}

export function SettingsView() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const settingsStore = useSettingsStore((state) => state);

  useEffect(() => {
    runRpc("getmodes").then((modes) => {
      if (modes) {
        const viewModes = parseViewModes(modes);
        viewModes.reverse(); // Reverse to have higher resolutions first
        settingsStore.setAvailableViewModes(viewModes);
      }
    });
    runRpc("getmode").then((mode) => {
      if (mode) {
        const parts = mode.split(" ");
        const width = parseInt(parts[0]);
        const height = parseInt(parts[1]);
        const windowmode = parseInt(parts[2]);
        const borderless = parseInt(parts[3]);
        settingsStore.setCurrentMode(new ViewModeState(windowmode, borderless, width, height));
      }
    });
  }, []);

  return (
    <div className="SettingsView-background p-8 rounded-lg shadow-lg mx-auto dark">
      <h1 className="text-5xl text-center SettingsView-main-title mb-2">Options</h1>
      {false && <SettingsSearch setSelectedGroup={setSelectedIndex} />}
      <TabGroup className="flex flex-col flex-1 h-0" selectedIndex={selectedIndex} onChange={(index) => setSelectedIndex(index)}>
        <TabList className="flex justify-center space-x-4 tf2-bold text-2xl">
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              className={classNames(
                selectedIndex === index
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white",
                "rounded-md px-3 py-2 text-xl uppercase",
              )}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="flex-1 h-0">
          {settingsData.categories.map((category) => (
            <TabPanel key={category.name} className="mt-6 h-full">
              <SettingsCategory key={category.name} category={category} />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}

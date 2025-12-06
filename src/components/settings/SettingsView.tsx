import settings from "@/data/settings.json";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useState } from "react";
import "./SettingsView.css"
import { SettingsCategory } from "./SettingsCategory";

type SettingsData = typeof settings;
const settingsData = settings as SettingsData;
const tabs = settingsData.categories.map((category) => category.name);

function classNames(...classes: string[]) {
  return classes.join(" ");
}

<style></style>

export function SettingsView() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="SettingsView-background p-8 rounded-lg shadow-lg mx-auto">
      <h1 className="text-5xl text-center SettingsView-main-title mb-4">Options</h1>
      <TabGroup className="flex flex-col flex-1" onChange={(index) => setSelectedIndex(index)}>
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
        <TabPanels className="flex-1">
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

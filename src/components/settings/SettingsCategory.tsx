import { useState } from "react";
import { SettingsGroup } from "./SettingsGroup";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.join(" ");
}

export function SettingsCategory({ category }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const groupNames = category.groups.map((group) => group.name);

  return (
    <TabGroup
      className="SettingsView-category-view"
      onChange={(index) => setSelectedIndex(index)}
    >
      <TabList className="flex flex-col space-y-4 border-e pe-2 me-4 tf2-light SettingsView-category-sidebar flex-1">
        {groupNames.map((groupName, index) => (
          <Tab
            key={groupName}
            className={classNames(
              selectedIndex === index
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white",
              "rounded-md px-3 py-2 text-lg font-medium",
            )}
          >
            {groupName}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="flex-4 h-full">
        {category.groups.map((group) => (
          <TabPanel key={group.name} className="h-full">
            <SettingsGroup key={group.name} group={group} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useMiniSearch } from "react-minisearch";
import settings from "@/data/settings.json";
import { useEffect, useMemo } from "react";

import useTabsStore from "@/store/tabs";

const searchOptions = {
  fields: ["label", "tooltip", "categoryName", "group"],
  storeFields: ["label", "category", "group"],
  searchOptions: {
    boost: {
      "categoryName": 3,
      "groupName": 2,
    },
    prefix: true,
    fuzzy: true,
  },
};

export function SettingsSearch({ setSelectedGroup }) {
  const searchableSettings = useMemo(() => {
    let id = 0;
    const options: Record<string, any>[] = [];
    settings.categories.forEach((category, categoryIdx) => {
      category.groups.forEach((group, groupIdx) => {
        for (const setting of group.settings) {
          options.push({
            id,
            label: setting.label,
            tooltip: setting.tooltip,
            categoryName: category.name,
            groupName: group.name,
            category: categoryIdx,
            group: groupIdx,
          });
          id++;
        }
      })
    });
    return options;
  }, []);

  const tabsStore = useTabsStore((state) => state);

  const { search, searchResults } = useMiniSearch(searchableSettings, searchOptions);

  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      return;
    }
    const firstResult = searchResults[0];
    setSelectedGroup(firstResult.category);
    tabsStore.setGroupSelectedTab(firstResult.categoryName, firstResult.group);
  }, [searchResults]);

  return (
    <div>
      <div className="grid grid-cols-1 mb-2 max-w-md mx-auto">
        <input
          id="settings-search"
          name="settings-search"
          type="text"
          placeholder="Search settings"
          onChange={(e) => {
            search(e.target.value);
          }}
          className="col-start-1 tf2-light row-start-1 block w-full rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 sm:pr-9 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-stone-500"
        />
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-gray-400 sm:size-4 dark:text-gray-500"
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import { SettingsItem } from "./SettingsItem";

export function SettingsGroup({ group }) {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="SettingsView-group-container">
      <div className="SettingsView-group">
        {group.settings.map((setting) => (
          <SettingsItem
            key={setting.id}
            setting={setting}
            setTooltip={setTooltip}
          />
        ))}
      </div>
      <div className="Settingsview-group-sidebar px-4 py-3">
        <p className="text-white text-2xl tf2-light">{tooltip}</p>
      </div>
    </div>
  );
}

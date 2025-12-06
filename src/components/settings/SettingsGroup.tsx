import { SettingsItem } from "./SettingsItem";


export function SettingsGroup({ group }) {
  return (
    <div className="SettingsView-group">
      {group.settings.map((setting) => <SettingsItem key={setting.id} setting={setting} />)}
    </div>
  );
}

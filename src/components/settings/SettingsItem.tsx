import { SettingsButton } from "./controls/SettingsButton";
import { SettingsCheck } from "./controls/SettingsCheck";
import { SettingsHeader } from "./controls/SettingsHeader";
import { SettingsSelect } from "./controls/SettingsSelect";
import { SettingsSlider } from "./controls/SettingsSlider";

export function SettingsItem({ setting, setTooltip }) {
  return (
    <div
      key={setting.id}
      className="mb-4"
      onMouseOver={() => {
        setTooltip(setting.tooltip ?? "");
      }}
      onMouseOut={() => {
        setTooltip("");
      }}
    >
      {setting.type === "check" && <SettingsCheck setting={setting} />}
      {setting.type === "slider" && <SettingsSlider setting={setting} />}
      {setting.type === "select" && <SettingsSelect setting={setting} />}
      {setting.type === "header" && <SettingsHeader setting={setting} />}
      {setting.type === "button" && <SettingsButton setting={setting} />}
    </div>
  );
}

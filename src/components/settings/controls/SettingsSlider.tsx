export function SettingsSlider({ setting }) {
  return (
    <div>
      <label className="mb-2 text-white tf2-light text-xl">
        {setting.label}
      </label>
      <div className="flex flex-row justify-between items-center w-2/5">
        <input
          className="me-4 flex-1"
          type="range"
          min={setting.min ?? 0}
          max={setting.max ?? 100}
          step={setting.step ?? 1}
        />
        <input
          type="number"
          className="mb-2 p-2 text-white bg-stone-800 border border-gray-300 w-20"
        />
      </div>
    </div>
  );
}

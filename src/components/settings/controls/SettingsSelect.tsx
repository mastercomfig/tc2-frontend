export function SettingsSelect({ setting }) {
    return (
        <div>
            <label className="block mb-2 text-white tf2-light text-xl">{setting.label}</label>
            <select className="px-4 py-2 mb-2 border text-white">
                {setting.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
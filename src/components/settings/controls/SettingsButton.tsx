export function SettingsButton({ setting }) {
    return (
        <div>
            <button className="px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700 tf2-light text-lg">
                {setting.label}
            </button>
        </div>
    )
}

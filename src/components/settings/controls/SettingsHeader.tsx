export function SettingsHeader({ setting }) {
    return (
        <div>
            <h1 className="text-xl text-white">
                {setting.label}
            </h1>
        </div>
    )
}
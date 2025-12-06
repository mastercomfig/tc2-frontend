export function SettingsCheck({ setting }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-8 grid-cols-1">
          <input
            id={setting.cvar}
            type="checkbox"
            className="col-start-1 row-start-1 appearance-none border border-gray-300 bg-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 checked:border-stone-400 checked:bg-stone-400 indeterminate:border-stone-400 indeterminate:bg-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:border-gray-300 forced-colors:appearance-auto"
          />
          <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-checked:opacity-100"
            />
            <path
              d="M3 7H11"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-indeterminate:opacity-100"
            />
          </svg>
        </div>
      </div>
      <div className="text-xl">
        <label
          className="font-medium text-white tf2-light"
          htmlFor={setting.cvar}
        >
          {setting.label}
        </label>
      </div>
    </div>
  );
}

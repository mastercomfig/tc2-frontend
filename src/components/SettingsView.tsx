const tabs = [
  { name: 'Game', href: '#', current: true },
  { name: 'Video', href: '#', current: false },
  { name: 'Audio', href: '#', current: false },
  { name: 'Keyboard / Mouse', href: '#', current: false },
  { name: 'Communication', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function SettingsView() {
  return (
    <div>
      <div className="block">
        <nav aria-label="Tabs" className="flex justify-center space-x-4 tf2-light uppercase text-2xl">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              aria-current={tab.current ? 'page' : undefined}
              className={classNames(
                tab.current
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white',
                'rounded-md px-3 py-2 text-lg font-medium',
              )}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

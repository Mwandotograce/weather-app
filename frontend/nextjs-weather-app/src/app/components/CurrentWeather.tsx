export default function CurrentWeather({
    city,
    country,
    temperature,
    temperatureUnit,
    icon,
    summary,
    description,
  }: {
    city: string;
    country: string;
    temperature: number;
    temperatureUnit: string;
    icon: string;
    summary: string;
    description: string;
  }) {
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  
    return (
      <aside className="sidebar h-full justify-start">
        <section className="sidebar-title items-center p-4">
          <svg
            fill="none"
            height="42"
            viewBox="0 0 32 32"
            width="42"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect height="100%" rx="16" width="100%"></rect>
            <path
              clipRule="evenodd"
              d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          <div className="flex flex-col">
            <span>NextJs Weather</span>
            <span className="text-xs font-normal text-content2">Team Plan</span>
          </div>
        </section>
        <section className="sidebar-content h-fit min-h-[20rem] overflow-visible">
          <nav className="menu rounded-md">
            <section className="menu-section items-center px-4">
              <span>Current Weather</span>
              <span className="text-lg">{summary}</span>
              <img src={iconUrl} alt="Weather Icon" className="w-24 h-24" />
              <span className="text-3xl font-bold">
                {temperature.toFixed(1)}°{temperatureUnit}
              </span>
              <span className="text-lg">{description}</span>
              <span className="text-sm text-gray-500">
                {city}, {country}
              </span>
            </section>
          </nav>
        </section>
        <section className="sidebar-footer h-full justify-end bg-gray-2 pt-2">
          <div className="divider my-0"></div>
          <div className="dropdown z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4">
            <label
              className="whites mx-2 flex h-fit w-full cursor-pointer p-0 hover:bg-gray-4"
              tabIndex={0}
            >
              <div className="flex flex-row gap-4 p-4">
                <div className="avatar avatar-md">
                  <img
                    src="https://i.pravatar.cc/150?img=30"
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col">
                  <span>Sandra Marx</span>
                  <span className="text-xs font-normal text-content2">
                    sandra
                  </span>
                </div>
              </div>
            </label>
            <div className="dropdown-menu dropdown-menu-right-top ml-2">
              <a className="dropdown-item text-sm">Profile</a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Account settings
              </a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Change email
              </a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Subscriptions
              </a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Change password
              </a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Refer a friend
              </a>
              <a tabIndex={-1} className="dropdown-item text-sm">
                Settings
              </a>
            </div>
          </div>
        </section>
      </aside>
    );
  }
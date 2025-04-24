export default function WindStatus({windSpeed, windDirection} : {windSpeed: number, windDirection: number}) {

    return (
        <div className="card card-compact flex-grow bg-base-100 shadow-xl items-center text-center p-6"> {/* wind status card */}
            <div className="text-sm text-gray-500 mb-2">Wind Status</div>
            <div className="text-4xl font-bold mb-2">{windSpeed} km/h</div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
                {/* Placeholder for direction icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{windDirection}°</span>
            </div>
          </div>
    )
}
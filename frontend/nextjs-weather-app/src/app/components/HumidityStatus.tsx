export default function HumidityStatus({humidity} : {humidity: number}) {

    return (
        <div className="card card-compact flex-grow bg-base-100 shadow-xl items-center text-center p-6"> {/* humidity card */}
            <div className="text-sm text-gray-500 mb-2">Humidity</div>
            <div className="text-4xl font-bold mb-4">{humidity}%</div>
            <progress className="progress" value={humidity} max="100"></progress>
        </div>
    )
}
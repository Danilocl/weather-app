export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    const formattedDate = date.toLocaleDateString('en-CA');

    const formattedTime = date.toLocaleString('en-US', options).split(', ')[1];

    return `${formattedDate} ${formattedTime}`;
}

export function kelvinToCelsius(kelvin) {
    const celsius = kelvin - 273.15;
    return `${celsius.toFixed(2)}°C`;
}

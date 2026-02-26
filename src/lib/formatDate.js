export function formatDate(dateString) {
    if (!dateString) return "Just now";

    try {
        const date = new Date(dateString);
        const dateOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} • ${formattedTime}`;
    } catch (error) {
        return dateString;
    }
}

/**
 * Formats an ISO date string into a readable format.
 * Example: "2023-10-24T10:30:00Z" -> "Oct 24, 2023 • 10:30 AM"
 * 
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} The formatted date and time.
 */
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

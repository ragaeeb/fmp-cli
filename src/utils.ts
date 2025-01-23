export const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);

    if (parts.length === 3) {
        // Format: hours:minutes:seconds
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
        // Format: minutes:seconds
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
    } else {
        throw new Error(`Invalid time format: ${time}`);
    }
};

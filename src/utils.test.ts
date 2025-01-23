import { describe, expect, it } from 'vitest';

import { timeToSeconds } from './utils';

describe('timeToSeconds', () => {
    it('should handle minutes and seconds', () => {
        expect(timeToSeconds('1:30')).toBe(90); // 1 minute, 30 seconds
        expect(timeToSeconds('2:15')).toBe(135); // 2 minutes, 15 seconds
    });

    it('should handle hours, minutes, and seconds', () => {
        expect(timeToSeconds('1:00:30')).toBe(3630); // 1 hour, 0 minutes, 30 seconds
        expect(timeToSeconds('2:15:45')).toBe(8145); // 2 hours, 15 minutes, 45 seconds
    });

    it('should handle leading zeros in hours, minutes, and seconds', () => {
        expect(timeToSeconds('01:02:03')).toBe(3723); // 1 hour, 2 minutes, 3 seconds
        expect(timeToSeconds('00:45')).toBe(45); // 0 minutes, 45 seconds
    });

    it('should handle large times', () => {
        expect(timeToSeconds('10:00:00')).toBe(36000); // 10 hours
        expect(timeToSeconds('25:59:59')).toBe(93599); // 25 hours, 59 minutes, 59 seconds
    });
});

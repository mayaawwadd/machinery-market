// src/components/Countdown.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

/**
 * Countdown takes an ISO date string or Date-compatible value as endTime,
 * and renders “DD:HH:MM:SS” updating every second.
 */
export default function Countdown({ endTime }) {
    const calculate = () => {
        const diff = dayjs(endTime).diff(dayjs());
        if (diff <= 0) return '00:00:00';
        const d = dayjs.duration(diff);
        // Format as HH:MM:SS; if you want days, you can prepend d.days()
        const hours = String(d.hours()).padStart(2, '0');
        const mins = String(d.minutes()).padStart(2, '0');
        const secs = String(d.seconds()).padStart(2, '0');
        return `${hours}:${mins}:${secs}`;
    };

    const [timeLeft, setTimeLeft] = useState(calculate());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculate());
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return <>{timeLeft}</>;
}

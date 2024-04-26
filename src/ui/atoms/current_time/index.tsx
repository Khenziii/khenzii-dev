"use client";

import { type FC, useEffect, useState } from "react";
import { type timezone } from "@khenzii-dev/ui/types";

export type CurrentTimeProps = {
    timezone?: timezone;
    accuracy?: "hours" | "minutes" | "seconds";
};

export const getDateWithTimezone = (timezone: timezone): Date => {
    const now = new Date();
    const nowString = now.toLocaleString("en-US", { timeZone: timezone });
    return new Date(Date.parse(nowString));
};

export const CurrentTime: FC<CurrentTimeProps> = ({ timezone = "Europe/Warsaw", accuracy = "minutes" }) => {
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const update = (): Date => {
            const currentDate = getDateWithTimezone(timezone);
            setNow(currentDate);

            return currentDate;
        };
        const currentDate = update();

        const minutesUntilEndOfHour = 60 - currentDate.getMinutes();
        const secondsUntilEndOfMinute = 60 - currentDate.getSeconds();
        const msUntilEndOfSecond = 1000 - currentDate.getMilliseconds();

        let msToSleepFor = 0;
        let msIntervalDuration = 0;
        switch (accuracy) {
            case "hours":
                msToSleepFor = minutesUntilEndOfHour * 1000 * 60 + secondsUntilEndOfMinute * 1000 + msUntilEndOfSecond;
                msIntervalDuration = 1000 * 60 * 60;
                break;
            case "minutes":
                msToSleepFor = secondsUntilEndOfMinute * 1000 + msUntilEndOfSecond;
                msIntervalDuration = 1000 * 60;
                break;
            case "seconds":
                msToSleepFor = msUntilEndOfSecond;
                msIntervalDuration = 1000;
                break;
        }

        const timeout = setTimeout(() => {
            const timer = setInterval(update, msIntervalDuration);

            return () => {
                clearInterval(timer);
            };
        }, msToSleepFor);

        return () => {
            clearTimeout(timeout);
        };
    }, [timezone, accuracy]);

    return (
        // TODO: use custom code component here
        <code>
            {accuracy === "hours" ? (
                `${now.getHours().toString().padStart(2, "0")}`
            ) : accuracy === "minutes" ? (
                `${now.getHours().toString().padStart(2, "0")}`
                + ":" +
                `${now.getMinutes().toString().padStart(2, "0")}`
            ) : (
                `${now.getHours().toString().padStart(2, "0")}`
                + ":" +
                `${now.getMinutes().toString().padStart(2, "0")}`
                + ":" +
                `${now.getSeconds().toString().padStart(2, "0")}`
            )}
        </code>
    );
};

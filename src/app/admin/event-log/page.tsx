"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { type AdminEvent } from "@khenzii-dev/server/backend";
import {
    Flex,
    Header,
    Loading,
    Paragraph,
    CodeBlock,
    Icon,
    Button,
} from "@khenzii-dev/ui/atoms";
import { api } from "@khenzii-dev/providers";

const AdminEventLog = () => {
    const loadingRef = useRef(null);
    const [eventsOffset, setEventsOffset] = useState(-1);
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [fetchedAllEvents, setFetchedAllEvents] = useState(false);
    const { data: eventsData } = api.eventLog.getEvents.useQuery(
        { offset: eventsOffset },
        {
            enabled: eventsOffset >= 0,
            // avoids random refetches that cause issues.
            staleTime: Infinity,
        },
    );

    const fetchMoreEvents = useCallback(() => {
        if (fetchedAllEvents) return;

        setEventsOffset((currentOffset) => currentOffset + 1);
    }, [fetchedAllEvents]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (!entry.isIntersecting) return;

                fetchMoreEvents();
            },
            { threshold: 0.1 },
        );

        const ref = loadingRef.current;
        if (!ref) return;

        observer.observe(ref);
        return () => {
            observer.unobserve(ref);
        };
    }, [fetchMoreEvents]);

    useEffect(() => {
        if (!eventsData) return;
        if (eventsData.length < 20) setFetchedAllEvents(true);

        setEvents((currentEvents) => [...currentEvents, ...eventsData]);
    }, [eventsData]);

    return (
        <Flex
            direction="column"
            align="center"
            styles={{ maxWidth: "95vw" }}
        >
            <Header>Event Log</Header>

            <Paragraph
                fontSize={1.5}
                styles={{ textAlign: "center" }}
            >
                <i>TIP: Click the button next to entries to copy the full JSON to your clipboard.</i>
            </Paragraph>

            {events.map((event, index) => (
                <Flex key={`event-${index}`} id={`event-${index}`}>
                    <Paragraph fontSize={1.5} styles={{ overflowWrap: "anywhere" }}>
                        <CodeBlock>
                            title: {event.title} <br />
                            created_at: {event.created_at.toString()} <br />
                            json: {JSON.stringify(event.json).length < 50
                                ? JSON.stringify(event.json)
                                : `${JSON.stringify(event.json).slice(0, 50)} [...]`
                            }
                        </CodeBlock>
                    </Paragraph>

                    <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(event.json))}>
                        <Icon iconName={"clipboard-fill"} size={1.5} />
                    </Button>
                </Flex>
            ))}
            
            {!fetchedAllEvents && (
                <div ref={loadingRef}>
                    <Loading size={100} />
                </div>
            )}
        </Flex>
    );
};

export default AdminEventLog;

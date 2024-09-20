"use client";

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
    const {
        data: eventsData,
        isLoading: eventsAreLoading,
    } = api.eventLog.getEvents.useQuery();

    return (
        <Flex
            direction="column"
            align="center"
        >
           <Header>Event Log</Header>

            <Paragraph fontSize={1.5}><i>TIP: Click the button next to entries to copy the full JSON to your clipboard.</i></Paragraph>

            {( eventsAreLoading || eventsData === undefined)
                ? (
                    <Loading size={100} />
                )
                : eventsData.map((event, index) => (
                    <Flex key={`event-${index}`} id={`event-${index}`}>
                        <Paragraph fontSize={1.5}>
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
                ))
            }
        </Flex>
    );
};

export default AdminEventLog;

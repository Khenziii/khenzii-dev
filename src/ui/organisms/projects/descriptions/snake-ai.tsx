import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

export const SnakeAiDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"In the past couple of years, the tech industry has been heavily investing into AI research. Interested by this, I wanted to give implementing one a try. Obviously, a simple snake playing "}
        <Anchor href={"https://en.wikipedia.org/wiki/Neural_network_(machine_learning)"} darkenOnHover newTab>{"neural network"}</Anchor>
        {" differs a lot from giant "}
        <Anchor href={"https://en.wikipedia.org/wiki/Large_language_model"} darkenOnHover newTab>{"LLMs"}</Anchor>
        {" like "}
        <Anchor href={"https://chatgpt.com"} darkenOnHover newTab>{"ChatGPT"}</Anchor>
        {", but nevertheless this project has given me important insight."}
    </Paragraph>
</>;

import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

export const CroissantdealerDescription = () => <>
    <Paragraph fontSize={1.25}>
        <Anchor href={"https://en.wikipedia.org/wiki/Deep_Blue_versus_Garry_Kasparov"} darkenOnHover newTab>{"Ever since 1997, chess engines have been better at playing chess than human world champions"}</Anchor>
        {". While croissantdealer is not the strongest chess engine you'll come across, it will definitely put up a challenge against most casual players. Thanks to this project I've had a chance to learn some "}
        <Anchor href={"https://en.wikipedia.org/wiki/Game_theory"} darkenOnHover newTab>{"game theory"}</Anchor>
        {", which is pretty interesting. The bot is currently running on "}
        <Anchor href={"https://lichess.org/@/croissantdealer"} darkenOnHover newTab>{"lichess"}</Anchor>
        {", so you can play with it if you wish."}
    </Paragraph>
</>;

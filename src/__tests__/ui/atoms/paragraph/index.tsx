import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Paragraph } from "@khenzii-dev/ui/atoms";

describe("Paragraph", () => {
  it("Contains the 'something' text if children set to 'something'", () => {
    render(<Paragraph>something</Paragraph>);

    const paragraph = screen.getByText("something");
    expect(paragraph).toBeInTheDocument();
  });
});


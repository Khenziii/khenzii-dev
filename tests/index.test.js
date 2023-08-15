// PageBackground.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For custom matchers

import Page from './Page'; // Replace with your actual component file
// Make sure that the Page component renders the content you want to test

describe('Page background color', () => {
  it('should have a certain background color', () => {
    const { container } = render(<Page />); // Render your component

    const pageElement = container.firstChild; // Assuming the background is set on the top-level element
    const expectedBackgroundColor = '#RRGGBB'; // Replace with the hex color you're testing for

    // Use the jest-dom library's `toHaveStyle` matcher to check the background color
    expect(pageElement).toHaveStyle(`background-color: ${expectedBackgroundColor}`);
  });
});
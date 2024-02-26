import type { Preview } from "@storybook/react";
import { khenziiDevTheme } from "./khenzii-dev-theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: khenziiDevTheme,
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#20201f',
        },
        {
          name: 'light',
          value: '#FFFFFF',
        }
      ],
    },
  },
};

export default preview;

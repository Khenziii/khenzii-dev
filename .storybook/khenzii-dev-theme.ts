import { create } from "@storybook/theming";

export const khenziiDevTheme = create({
    base: "dark",
    fontBase: '"Montserrat", sans-serif',
    fontCode: 'monospace',
    brandTitle: 'khenzii.dev - storybook',
    brandUrl: 'https://khenzii.dev/',
    brandImage: 'https://khenzii.dev/logo.svg',
    brandTarget: '_self',
    colorPrimary: '#5b5e5e',
    colorSecondary: '#5b5e5e',
    appBg: '#171617', // left search thing
    appContentBg: '#20201f', // main section
    appPreviewBg: '#20201f',
    appBorderColor: '#20201f',
    appBorderRadius: 4,
    textColor: '#ffffff',
    textInverseColor: '#20201f',
    barTextColor: '#ffffff',
    barSelectedColor: '#ffffff',
    barBg: '#171617',
    inputBg: '#171617',
    inputBorder: '#20201f',
    inputTextColor: '#ffffff',
    inputBorderRadius: 2,
    booleanBg: '#171617',
    booleanSelectedBg: '#5b5e5e',
    barHoverColor: '#5b5e5e',
    buttonBg: '#171617',
    buttonBorder: '#5b5e5e',
    textMutedColor: '#ffffff',
})

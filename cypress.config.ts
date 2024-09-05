import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        supportFile: false,
        specPattern: "src/cypress/**/*.ts*",
        baseUrl: 'http://localhost:3000',
    },
});

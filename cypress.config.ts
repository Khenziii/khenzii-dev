import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        supportFile: false,
        specPattern: "cypress/**/*.ts*",
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on) {
            on("task", {
                // allows logging to console from
                // the browser environment using:
                // `cy.task("log", "message")`
                log(message) {
                    console.log(message);
                    return null;
                },
            });
        },
    },
    screenshotOnRunFailure: false,
});

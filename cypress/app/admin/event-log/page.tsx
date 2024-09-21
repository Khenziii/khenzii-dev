import { assertAdminLogin } from "@khenzii-dev-tests/utils";

describe("Admin Event Log Page", () => {
    beforeEach("Shows the admin login prompt", () => assertAdminLogin({
        route: "event-log",
    }));
    
    it("Fetches events", () => {
        cy.get("#event-0").should("exist");
        cy.get("#event-0").should("contain.text", "Successful login occurred");
    });
});


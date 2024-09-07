describe("Home Page", () => {
    it("Contains the 'Khenzii' text", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
        cy.visit(baseUrl);

        cy.get("body").should("contain", "Khenzii");
    });
});


type assertAdminLoginArgs = {
    route: string
};

export const assertAdminLogin = ({
    route,
}: assertAdminLoginArgs) => {
    const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
    cy.visit(`${baseUrl}/admin/${route}`);

    cy.wait(10000);

    // esnure, that elements are visible.
    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='password']").should("be.visible");
    cy.get("button").contains("Login").should("be.visible");

    // ensure, that it's possible to interact with them.
    cy.get("input[type='email']").type("test.user@mail.com");
    cy.get("input[type='password']").type("test-user's-password");
    cy.get("button").contains("Login").click();
    
    cy.wait(10000);

    // ensure, that interaction leads to a successful login.
    cy.getCookie('next-auth.session-token').should('exist');
}


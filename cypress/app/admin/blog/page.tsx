import { assertAdminLogin } from "@khenzii-dev-tests/utils";

describe("Admin Blog Page", () => {
    beforeEach("Shows the admin login prompt", () => assertAdminLogin({
        route: "blog",
    }));

    it("Allows creating tags", () => {
        cy.get("#add-tag-button").click();
        cy.get("#dialog").should("be.visible");
        cy.get("#tag-input-name").type("test-tag");
        cy.get("#dialog-submit-button").click();
    });

    it("Fetches tags", () => {
        cy.get("#tag-0").should("exist");
        cy.get("#tag-0").should("contain.text", "test-tag");
    });

    it("Allows updating tags", () => {
        cy.get("#update-tag-button-0").click();
        cy.get("#dialog").should("be.visible");
        cy.get("#tag-input-name").type("updated-tag");
        cy.get("#dialog-submit-button").click();
    });

    it("Allows creating posts", () => {
        cy.get("#add-post-button").click();
        cy.get("#dialog").should("be.visible");
        cy.get("#post-input-title").type("test-post");
        cy.get("#post-input-content").type("test-post-content");
        cy.get("#dialog-submit-button").click();
    });

    it("Fetches posts", () => {
        cy.get("#post-0").should("exist");
        cy.get("#post-0").should("contain.text", "test-post");
    });

    it("Allows updating posts", () => {
        cy.get("#update-post-button-0").click();
        cy.get("#dialog").should("be.visible");
        cy.get("#post-input-title").type("updated-post");
        cy.get("#post-input-content").type("updated-post-content");
        cy.get("#dialog-submit-button").click();
    });

    it("Allows deleting tags", () => {
        cy.get("#tag-0").should("exist");
        cy.get("#delete-tag-button-0").click();
    });
    
    it("Allows deleting posts", () => {
        cy.get("#post-0").should("exist");
        cy.get("#delete-post-button-0").click();
    });
});


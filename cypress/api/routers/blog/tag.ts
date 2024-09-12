describe("API Tag Router", () => {
    let newTagId: string;
    const newTag = { name: "test-tag" };
    const updatedTag = { name: "updated-tag" };

    it("Allows creating tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";

        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.createTag`,
            body: { input: newTag },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
            expect(response.body.data).to.have.property("json");
            expect(response.body.data.json).to.have.property("id");
            expect(response.body.data.json).to.have.property("name");

            newTagId = response.body.data.json.id;
        });
    });

    it("Allows fetching tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";

        cy.request({
            method: "GET",
            url: `${baseUrl}/api/trpc/blog.blogTag.getTags`,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
            expect(response.body.data).to.have.property("json");
            expect(response.body.data.json).to.have.property("id");
            expect(response.body.data.json).to.have.property("name");
            expect(response.body.data.json.name).to.eq(newTag.name);
            expect(response.body.data.json.id).to.eq(newTagId);
        });
    });

    it("Allows updating tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";

        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.updateTag`,
            body: { input: {
                tagId: newTagId,
                updatedTag: updatedTag,
            } },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data");
            expect(response.body.data).to.have.property("json");
            expect(response.body.data.json).to.have.property("id");
            expect(response.body.data.json).to.have.property("name");
            expect(response.body.data.json.name).to.eq(newTag.name);
        });
    });

    it("Allows deleting tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";

        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.getTags`,
            body: { input: { tagId: newTagId } },
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });
});


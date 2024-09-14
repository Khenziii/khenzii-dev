describe("API Tag Router", () => {
    let newTagId: string;
    const newTag = { name: "test-tag" };
    const updatedTag = { name: "updated-tag" };

    it("Allows creating tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
    
        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.createTag`,
            body: { json: newTag },
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("name");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("postIDs");
           
            newTagId = response.body.result.data.json.id;
        });
    });
    
    it("Allows fetching tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";

        cy.request({
            method: "GET",
            url: `${baseUrl}/api/trpc/blog.blogTag.getTags`,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json[0]).to.have.property("name");
            expect(response.body.result.data.json[0]).to.have.property("id");
            expect(response.body.result.data.json[0]).to.have.property("postIDs");
            expect(response.body.result.data.json[0].name).to.eq(newTag.name);
        });
    });

    it("Allows updating tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
    
        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.updateTag`,
            body: { json: {
                id: newTagId,
                updatedTag: updatedTag,
            } },
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("name");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("postIDs");
            expect(response.body.result.data.json.name).to.eq(updatedTag.name);
        });
    });
    
    it("Allows deleting tags", () => {
        const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
    
        cy.request({
            method: "POST",
            url: `${baseUrl}/api/trpc/blog.blogTag.deleteTag`,
            body: { json: { id: newTagId } },
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });
});


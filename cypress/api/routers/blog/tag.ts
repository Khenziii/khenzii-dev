import { apiRequest } from "@khenzii-dev-tests/utils";

describe("API Tag Router", () => {
    let newTagId: string;
    const newTag = { name: "test-tag" };
    const updatedTag = { name: "updated-tag" };

    it("Allows creating tags", () => {
        const createTagTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("name");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("postIDs");
           
            newTagId = response.body.result.data.json.id;
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogTag.createTag",
            data: newTag,
            callback: createTagTest,
        });
    });
    
    it("Allows fetching tags", () => {
        const fetchTagsTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json[0]).to.have.property("name");
            expect(response.body.result.data.json[0]).to.have.property("id");
            expect(response.body.result.data.json[0]).to.have.property("postIDs");
            expect(response.body.result.data.json[0].name).to.eq(newTag.name);
        };

        apiRequest({
            method: "GET",
            tRPCPath: "blog.blogTag.getTags",
            callback: fetchTagsTest,
        });
    });

    it("Allows updating tags", () => {
        const updateTagTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("name");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("postIDs");
            expect(response.body.result.data.json.name).to.eq(updatedTag.name);
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogTag.updateTag",
            data: {
                id: newTagId,
                updatedTag: updatedTag,
            },
            callback: updateTagTest,
        });
    });
    
    it("Allows deleting tags", () => {
        const deleteTagTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogTag.deleteTag",
            data: { id: newTagId },
            callback: deleteTagTest,
        });
    });
});


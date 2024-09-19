import { apiRequest } from "@khenzii-dev-tests/utils";

describe("API Post Router", () => {
    let newPostId: string;
    const newPost = {
        title: "test-post",
        content: "test-post's content",
        created_at: new Date(),
        tagIDs: [],
    };
    const updatedPost = { title: "updated-post" };

    it("Allows creating posts", () => {
        const createPostTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("title");
            expect(response.body.result.data.json).to.have.property("content");
            expect(response.body.result.data.json).to.have.property("created_at");
            expect(response.body.result.data.json).to.have.property("tagIDs");
           
            newPostId = response.body.result.data.json.id;
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogPost.createPost",
            data: newPost,
            callback: createPostTest,
        });
    });
    
    it("Allows fetching posts", () => {
        const fetchPostsTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json[0]).to.have.property("id");
            expect(response.body.result.data.json[0]).to.have.property("title");
            expect(response.body.result.data.json[0]).to.have.property("content");
            expect(response.body.result.data.json[0]).to.have.property("created_at");
            expect(response.body.result.data.json[0]).to.have.property("tagIDs");
            expect(response.body.result.data.json[0].title).to.eq(newPost.title);
        };

        apiRequest({
            method: "GET",
            tRPCPath: "blog.blogPost.getPosts",
            callback: fetchPostsTest,
        });
    });

    it("Allows updating posts", () => {
        const updatePostTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("result");
            expect(response.body.result).to.have.property("data");
            expect(response.body.result.data).to.have.property("json");
            expect(response.body.result.data.json).to.have.property("id");
            expect(response.body.result.data.json).to.have.property("title");
            expect(response.body.result.data.json).to.have.property("content");
            expect(response.body.result.data.json).to.have.property("created_at");
            expect(response.body.result.data.json).to.have.property("tagIDs");
            expect(response.body.result.data.json.title).to.eq(updatedPost.title);
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogPost.updatePost",
            data: {
                id: newPostId,
                updatedPost,
            },
            callback: updatePostTest,
        });
    });
    
    it("Allows deleting posts", () => {
        const deletePostTest = (response: Cypress.Response<any>) => {
            expect(response.status).to.equal(200);
        };

        apiRequest({
            method: "POST",
            tRPCPath: "blog.blogPost.deletePost",
            data: { id: newPostId },
            callback: deletePostTest,
        });
    });
});


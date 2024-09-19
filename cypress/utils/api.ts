export type Method = 
    "GET"
    | "POST"

type apiRequestArgs = {
    method: Method,
    tRPCPath: string,
    callback: (response: Cypress.Response<any>) => void,
    data?: object,
}

// a simple wrapper for `cy.request`, to avoid duplicating code.
export const apiRequest = ({
    method,
    tRPCPath,
    callback,
    data,
}: apiRequestArgs) => {
    const baseUrl = Cypress.config().baseUrl ?? "http://localhost:3000";
    const url = `${baseUrl}/api/trpc/${tRPCPath}`;

    let request: Partial<Cypress.RequestOptions> = {
        method,
        url,
    };

    if (data) {
        request.body = { json: data };
        request.headers = { "Content-Type": "application/json" };
    }

    cy.request(request).then((response) => callback(response));
}


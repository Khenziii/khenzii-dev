const username_paragraph = document.querySelector(".username");
const username = window.location.href.split("/").pop()

async function getValuesFromServer(table, column, where_something, where_value){
    return fetch('/blog/get_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([`"${table}"`, `${column}`, `${where_something}`, `${where_value}`])
        // retrieve stuff using this syntax: SELECT <second_index> FROM <first_index> WHERE <third_index> = <fourth_index>; (screw indexing from 0, lol)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    }).catch(error => {
        // Handle any error that occurred during the request
        return `something went wrong.. :( ${error}`
    });
}


username_paragraph.textContent = username;


getValuesFromServer("user", "id", "username", `${username}`).then(data => {
    
});
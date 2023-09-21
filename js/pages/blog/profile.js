const username_paragraph = document.querySelector(".username");
const pfp_image = document.getElementById("pfp");

if(window.location.href.endsWith('/')) {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 2]
} else {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 1]
}

username_paragraph.textContent = username;


async function getValuesFromServer(username){
    return fetch('/blog/api/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([username])
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

getValuesFromServer(username).then(data => {
    console.log(data)
    console.log(data.image)
    console.log(data.user_id)
    console.log(data.bio_and_links)

    pfp_image.src = data.image;
});
const usersList = document.getElementById("users_list");


var users = {}
var times = 0
var not_all = true


function createUserHTML(default_pfp, pfp_path, username, bio) {
    var userHTML = ""

    if (default_pfp) {
        var userHTML = `
        <li>
            <a href="/blog/user/${username}" class="user_container">
                <div class="pfp_container">
                    <img src="../../../icons/pages/blog/pfp_placeholder.png" alt="user's profile picture" class="pfp">
                </div>
    
                <p class="username">
                    ${username}
                </p>
    
                <hr class="profile_line">
    
                <p class="bio">
                    ${bio}
                </p>
            </a>
        </li>
        `
    } else {
        var userHTML = `
        <li>
            <a href="/blog/user/${username}" class="user_container">
                <div class="pfp_container">
                    <img src="${pfp_path}" alt="user's profile picture" class="pfp">
                </div>
    
                <p class="username">
                    ${username}
                </p>
    
                <hr class="profile_line">
    
                <p class="bio">
                    ${bio}
                </p>
            </a>
        </li>
        `
    }

    usersList.insertAdjacentHTML('beforeend', userHTML);
}

async function getUsersFromServer(times) {
    const data = {
        times: times
    };

    const response = await fetch('/blog/api/get_users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json()
}

async function getUserFromServer(user_id) {
    const response = await fetch('/blog/api/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([user_id])
    });

    return await response.json()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function main() {
    while (not_all) {
        await getUsersFromServer(times).then(async data => {
            for (let i = 0; i < data.users.length; i++) {
                await getUserFromServer(data.users[i].username).then(user_data => {
                    var default_pfp = true
                    if(user_data.image != "/icons/pages/blog/pfp_placeholder.png") {
                        default_pfp = false
                    }

                    createUserHTML(default_pfp, user_data.image, data.users[i].username, user_data.bio_and_links.text_value)
                })

                // sleep for a second to not get rate limited
                await sleep(1000)
            }

            times += 1

            // if got all of the users (number of the posts that the server 
            // should return is larger than what it returned), stop sending requests
            if (data.number_of_posts_to_get > data.users.length) {
                not_all = false
            }
        })
    }
}

main()
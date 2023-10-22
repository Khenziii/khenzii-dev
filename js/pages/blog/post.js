const shadowEffect = document.getElementById("shadowEffect");
const post_container = document.getElementById("post_container")
const showMoreBox = document.getElementById("more_box");
const closeShowMoreBox = document.getElementById("more_box_close");
const showMoreBoxButtonContainer = document.getElementById("more_button_container");
const showInfoBox = document.getElementById("more_info_box");
const closeShowInfoBox = document.getElementById("more_info_box_close");
const showShareBox = document.getElementById("more_share_box");
const closeShowShareBox = document.getElementById("more_share_box_close");
const backToProfileButton = document.getElementById("back_to_profile_button");
const underButton = document.getElementById("under_button");
const underPfp = document.getElementById("username");
const pfp = document.getElementById("pfp");

function shadowEffectStart() {
    shadowEffect.style.display = "block";
}

function shadowEffectEnd() {
    shadowEffect.style.display = "none";
}

function showMore(info_text) {
    // if the elements already exist, don't create stuff
    const info_button_element_old = document.getElementById('more_box_info');
    const share_button_element_old = document.getElementById('more_box_share');
    if (info_button_element_old || share_button_element_old) {
        // show and return
        showMoreBox.style.display = "flex";
        shadowEffectStart()
        return
    }


    // define the buttons
    // define the info button
    const info_button = `
    <button class="more_button_info" id="more_box_info" onclick="showInfo('${info_text}')">
        <img src="../../../icons/pages/blog/info.png" alt="info button" class="more_button_info_image">
    </button>
    `

    // get the post id
    const id = JSON.parse(decodeURIComponent(info_text))["post id"];

    // define the share button
    var share_button = `
    <button class="more_button_share" id="more_box_share" onclick="showShare('https://khenzii.dev/blog/post/${id}')">
        <img src="../../../icons/pages/blog/share.png" alt="share button" class="more_button_share_image">
    </button>
    `

    // create the elements
    showMoreBoxButtonContainer.insertAdjacentHTML('beforeend', info_button)
    showMoreBoxButtonContainer.insertAdjacentHTML('beforeend', share_button)

    showMoreBox.style.display = "flex";
    shadowEffectStart()
}

function changeUserProfilePicutre(path) {
    pfp.setAttribute("src", `${path}`);
}

function changeUserText(username) {
    underButton.textContent = `^ ${username}'s profile ^`
    underPfp.textContent = `${username}`
}

function changeProfileButton(username) {
    backToProfileButton.setAttribute("onclick", `redirectTo('/blog/user/${username}', event)`)
}

function changeUserInfo(user_id) {
    getUsernameFromServer(user_id).then(username => {
        changeUserText(username)
        changeProfileButton(username)

        getUserFromServer(username).then(data => {
            changeUserProfilePicutre(data.image)
        });
    });
}

function createHTMLPost(text_value, created_at, id, category_id, category_index_in_user, index_in_category) {
    /// check if the post contains a image or video, if so, style them
    // Define a regular expression to match <img> and <video> tags
    const mediaRegex = /<img[^>]*>|<video[^>]*>/g;

    // Replace <img> and <video> tags with modified versions
    const modifiedText = text_value.replace(mediaRegex, (match) => {
        // Check if the matched tag is an <img> or <video>
        if (match.startsWith("<img")) {
            // If it's an <img> tag, add the max-width and height styles
            return match.replace(">", ' style="max-width: 100%; height: auto; margin-block: 1vh;" draggable="false" alt="sum image">');
        } else if (match.startsWith("<video")) {
            // If it's a <video> tag, add the max-width and height styles
            return match.replace(">", ' style="max-width: 100%; height: auto; margin-block: 1vh;" draggable="false" alt="sum video" controls="true">');
        }
        return match;
    });

    const info = {
        "category id": `${category_id}`,
        "category index in user": `${category_index_in_user}`,
        "post id": `${id}`,
        "index in category": `${index_in_category}`,
    }

    const post = `
    <div class="post">
        <div class="post_ui">
            <p class="post_created_at">
                ${created_at}
            </p>

            <button class="post_more" onclick="showMore('${encodeURIComponent(JSON.stringify(info))}', 'post')">
                <img src="../../../icons/pages/blog/more.png" class="post_more_image" draggable=false>
            </button>
        </div>

        <p class="post_text">
            ${modifiedText}
        </p>

        <hr class="line">
     </div>
    `

    return post_container.insertAdjacentHTML('beforeend', post)
}

function copyToClipboard(text, parent_id) {
    const parent_element = document.getElementById(parent_id);

    const info_text_share_element = document.getElementById("info_text_share");

    navigator.clipboard.writeText(text).then(() => {
        var message = "Copied to the clipboard!";

        // if the element already exists
        if (info_text_share_element) {
            info_text_share_element.textContent = message;
        } else {
            // if not, create it
            const info_text_share = `
            <p class="info_text_share" id="info_text_share">
                ${message}
            </p>
            `

            parent_element.insertAdjacentHTML('beforeend', info_text_share)
        }
    }, () => {
        var message = "Failed to copy to the clipboard! :(";

        // if the element already exists
        if (info_text_share_element) {
            info_text_share_element.textContent = message;
        } else {
            // if not, create it
            const info_text_share = `
            <p class="info_text_share" id="info_text_share">
                ${message}
            </p>
            `

            parent_element.insertAdjacentHTML('beforeend', info_text_share)
        }
    });
}

function showInfo(info_dictionary) {
    // expected argument is a string that we can convert into a dictionary, it contains 
    // names and values of paragraphs, we create every single one of them
    const info = JSON.parse(decodeURIComponent(info_dictionary));

    // if the element already exist, don't create stuff
    const info_list_element_old = document.getElementById('info_list');
    if (info_list_element_old) {
        let iteration = 0
        for (const key in info) {
            const value = info[key];

            if (info_list_element_old.children[iteration]) {
                // if the element exists, change the text content
                info_list_element_old.children[iteration].children[0].textContent = `${key}: ${value}`
            } else {
                // if it doesn't create it
                const paragraph = `
                <li>
                    <p class="info_text">
                        ${key}: ${value}
                    </p>
                </li>
                `

                info_list_element_old.insertAdjacentHTML('beforeend', paragraph);
            }

            iteration++;
        }

        // show stuff
        showInfoBox.style.display = "flex";
        return
    }

    // define stuff
    const info_list = `
    <ul class="info_list" id="info_list">

    </ul>
    `

    // create stuff
    showInfoBox.insertAdjacentHTML('beforeend', info_list);

    // create the info paragraphs
    return showInfo(info_dictionary)
}

function showShare(url) {
    // if the elements already exist, don't create stuff
    const link_preview_element_old = document.getElementById('share_link_preview');
    const copy_element_old = document.getElementById('copy_button');
    if (link_preview_element_old || copy_element_old) {
        // show stuff
        showShareBox.style.display = "flex";
        return
    }

    // define stuff
    const link_preview = `
    <code class="share_link_preview" id="share_link_preview">
        ${url}
    </code>
    `

    const copy_button = `
    <button class="copy_button" onclick="copyToClipboard('${url}', 'more_share_box')" id="copy_button">
        <img src="../../../icons/pages/blog/copy.png" class="copy_button_image" alt="copy icon">
    </button>
    `

    // create stuff
    showShareBox.insertAdjacentHTML('beforeend', link_preview)
    showShareBox.insertAdjacentHTML('beforeend', copy_button)

    // show stuff
    showShareBox.style.display = "flex";
}

async function getUserFromServer(username) {
    return fetch('/blog/api/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([username])
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

async function getUsernameFromServer(user_id) {
    return fetch('/blog/api/get_username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([user_id])
    }).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Something went wrong');
        }
    }).catch(error => {
        // Handle any error that occurred during the request
        return `something went wrong.. :( ${error}`
    });
}

async function getCategoryFromServer(category_id) {
    return fetch('/blog/api/get_category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([category_id])
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

async function getPostFromServer(post_id) {
    return fetch('/blog/api/get_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([post_id])
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

closeShowMoreBox.onclick = function () {
    showMoreBox.style.display = "none";
    shadowEffectEnd()
}

closeShowInfoBox.onclick = function () {
    showInfoBox.style.display = "none";
}

closeShowShareBox.onclick = function () {
    // remove the info text if it exists
    // (we don't want it to show up again if the user will try to copy other url)
    const info_text_share_element = document.getElementById("info_text_share");
    if (info_text_share_element) {
        info_text_share_element.remove();
    }

    showShareBox.style.display = "none";
}

// get the post id
var post_id = ""
if (window.location.href.endsWith('/')) {
    var post_id = window.location.href.split("/")[window.location.href.split("/").length - 2]
} else {
    var post_id = window.location.href.split("/")[window.location.href.split("/").length - 1]
}

getPostFromServer(post_id).then(data_post => {
    getCategoryFromServer(data_post.rows[0].category_id).then(data_category => {
        // create the user profile info here
        changeUserInfo(data_category.rows[0].user_id)

        // create the post
        createHTMLPost(data_post.rows[0].text_value, data_post.rows[0].created_at, data_post.rows[0].id, data_post.rows[0].category_id, data_category.rows[0].index_in_user, data_post.rows[0].index_in_category)
    });
});
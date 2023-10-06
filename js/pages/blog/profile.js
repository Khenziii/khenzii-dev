const profile_container = document.getElementById("profile_container");
const username_paragraph = document.getElementById("username");
const pfp_image = document.getElementById("pfp");
const bio_paragraph = document.getElementById("bio");
const joined_at_paragraph = document.getElementById("joined_at");
const user_id_paragraph = document.getElementById("user_id");
const content_container = document.getElementById(`content_container`);
const categories_element = document.getElementById("categories");
const shadowEffect = document.getElementById("shadowEffect");
const createCategoryPopout = document.getElementById("create_category");
const closeCreateCategoryPopout = document.getElementById("create_category_close");
const createCategoryButton = document.getElementById("create_category_create_button");
const categoryTitleInput = document.getElementById("category_title_input");
const categoryDescriptionInput = document.getElementById("category_description_input");
const createPostPopout = document.getElementById("create_post");
const closeCreatePostPopout = document.getElementById("create_post_close");
const createPostButton = document.getElementById("create_post_create_button");
const postInput = document.getElementById("post_input");
const infoBox = document.getElementById("info_box");
const closeInfoBox = document.getElementById("info_box_close");
const infoBoxText = document.getElementById("info_box_text");
const showMoreBox = document.getElementById("more_box");
const closeShowMoreBox = document.getElementById("more_box_close");
const showMoreBoxButtonContainer = document.getElementById("more_button_container");
// this line is useless, since infoShowMoreBox is not yet created here: const infoShowMoreBox = document.getElementById("more_box_info");
// this line is useless, since deleteShowMoreBox is not yet created here: const deleteShowMoreBox = document.getElementById("more_box_delete");
const showInfoBox = document.getElementById("more_info_box");
const showShareBox = document.getElementById("more_share_box");
const showDeleteBox = document.getElementById("more_delete_box");
const closeShowInfoBox = document.getElementById("more_info_box_close");
const closeShowShareBox = document.getElementById("more_share_box_close");
const closeShowDeleteBox = document.getElementById("more_delete_box_close");
const sureInput = document.getElementById("sure_input");
const deleteButton = document.getElementById("delete_button");


var first_time = {}
var how_much_times = {}

var highest_id_posts = -1

var reload = false
var reload_category_to_open = null
var category_create_button_clickable = true
var post_create_button_clickable = true

function infoBoxShow(text) {
    infoBox.style.display = "flex";
    shadowEffectStart()

    infoBoxText.textContent = text;
}

function removeShowMoreButtonHTML(category_id) {
    const button_element = document.getElementById(`show_more_posts_button_${category_id}`)

    if (button_element != null) {
        button_element.remove(); // delete the element
    }
}

function createShowMoreButtonHTML(category_id) {
    const posts_list_element = document.getElementById(`${category_id}_posts`);
    const button = `
    <button class="show_more_posts_button" id="show_more_posts_button_${category_id}" onclick="getPosts(${category_id}, true)">
        fetch more posts!
    </button>
    `

    return posts_list_element.insertAdjacentHTML('beforeend', button)
}

async function change_category_index(first_index, second_index) {
    // make the elements not draggable
    // (they will become draggable again after
    // finishing the first change)
    var draggables = document.getElementsByClassName("category_drag");

    // Iterate through the elements and make them non-draggable
    for (let i = 0; i < draggables.length; i++) {
        draggables[i].draggable = false;
        draggables[i].classList.add("no")
    }

    const data = {
        user_id: user_id,
        first_category_index: first_index,
        second_category_index: second_index
    };

    const response = await fetch('/blog/api/change_category_index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    var text = await response.text()

    if (response.status !== 429) {
        reload = true
    }

    return text
}

async function getPosts(category_id, clicked_button) {
    if (first_time[category_id] == false && !clicked_button) {
        return
    }

    first_time[category_id] = false

    if (how_much_times[category_id] == null) {
        how_much_times[category_id] = 1
    }

    const data = {
        category_id: category_id,
        times: how_much_times[category_id] // more info in server.js on line 617
    };

    const response = await fetch('/blog/api/get_posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const response_json = await response.json()

    var posts = response_json["rows"];
    var number_of_posts_to_get = response_json["number_of_posts_to_get"];
    how_much_times[category_id]++;

    removeShowMoreButtonHTML(category_id)

    for (let i = 0; i < posts.length; i++) {
        createHTMLPost(posts[i].text_value, posts[i].created_at, posts[i].id, category_id, posts[i].index_in_category)
    }

    // create the "fetch more!" button if we got back the right amount of posts to get and the last one wasn't first in the category
    if (posts.length == number_of_posts_to_get && posts[posts.length - 1].index_in_category != 1) {
        createShowMoreButtonHTML(category_id)
    }
}

function categoryCreateInfo(text) {
    const info_text = `
    <p class="create_category_info_text">${text}</p>
    `

    return createCategoryPopout.insertAdjacentHTML('beforeend', info_text)
}

function postCreateInfo(text) {
    const info_text = `
    <p class="create_post_info_text">${text}</p>
    `

    return createPostPopout.insertAdjacentHTML('beforeend', info_text)
}

async function createCategory() {
    // make the create button not clickable
    // (it will become clickable again after
    // finishing the creation of the category)
    if (category_create_button_clickable == false) {
        return
    }

    createCategoryButton.classList.add("no");
    category_create_button_clickable = false

    const categoryTitleInputValue = categoryTitleInput.value;
    const categoryDescriptionInputValue = categoryDescriptionInput.value;

    const data = {
        categoryTitle: categoryTitleInputValue,
        categoryDescription: categoryDescriptionInputValue,
        user_id: user_id
    };

    const response = await fetch('/blog/api/create_category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    var text = await response.text();
    createCategoryButton.classList.remove("no");
    category_create_button_clickable = true
    categoryCreateInfo(text)

    reload = true
}

async function createPost() {
    // make the create button not clickable
    // (it will become clickable again after
    // finishing the creation of the post)
    if (post_create_button_clickable == false) {
        return
    }

    createPostButton.classList.add("no");
    post_create_button_clickable = false

    const postTextContentValue = postInput.value

    const data = {
        category_id: createPostPopout.style.data_category_id,
        text_value: postTextContentValue
    };

    const response = await fetch('/blog/api/create_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    var text = await response.text();
    createPostButton.classList.remove("no");
    post_create_button_clickable = true
    postCreateInfo(text)

    // set the reload to true and get
    // category to open after reload
    reload = true

    // get the element
    const category_element = document.querySelector(`[data-id="${createPostPopout.style.data_category_id}"]`);
    const category_index = category_element.getAttribute("data-index")
    reload_category_to_open = category_index
}

function shadowEffectStart() {
    shadowEffect.style.display = "block";
}

function shadowEffectEnd() {
    shadowEffect.style.display = "none";
}

function showCreateCategoryPopout() {
    createCategoryPopout.style.display = "flex";
    shadowEffectStart()
}

function showCreatePostPopout(category_id) {
    createPostPopout.style.display = "flex";
    createPostPopout.style.data_category_id = category_id; // we store the category id here (we can later access it while sending the API request)
    shadowEffectStart()
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
    console.log(info)

    // if the element already exist, don't create stuff
    const category_info_list_element_old = document.getElementById('category_info_list');
    if (category_info_list_element_old) {
        let iteration = 0
        for (const key in info) {
            const value = info[key];

            if(category_info_list_element_old.children[iteration]) {
                // if the element exists, change the text content
                category_info_list_element_old.children[iteration].children[0].textContent = `${key}: ${value}`
            } else {
                // if it doesn't create it
                const paragraph = `
                <li>
                    <p class="category_info_text">
                        ${key}: ${value}
                    </p>
                </li>
                `

                category_info_list_element_old.insertAdjacentHTML('beforeend', paragraph);
            }

            iteration++;
        }

        // show stuff
        showInfoBox.style.display = "flex";
        return
    }

    // define stuff
    const category_info_list = `
    <ul class="category_info_list" id="category_info_list">

    </ul>
    `

    // create stuff
    showInfoBox.insertAdjacentHTML('beforeend', category_info_list);

    // create the info paragraphs
    return showInfo(info_dictionary)
}

function showShare(url) {
    // if the elements already exist, don't create stuff
    const link_preview_element_old = document.getElementById('share_link_preview');
    const copy_element_old = document.getElementById('copy_button');
    if (link_preview_element_old || copy_element_old) {
        // change stuff
        if (link_preview_element_old) {
            link_preview_element_old.textContent = url;
        }

        if (copy_element_old) {
            copy_element_old.setAttribute("onclick", `copyToClipboard('${url}', 'more_share_box')`);
        }

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

function deletePost() {
    deleteButton.classList.add("no");

    // send a request to the API to delete the category

    // set the display of delete button to none
    // edit the info paragraph and set it's display to block
}

function deleteCategory() {
    deleteButton.classList.add("no");

    // send a request to the API to delete the category

    // set the display of delete button to none
    // edit the info paragraph and set it's display to block
}

function showDelete(type, id) {
    if (type === "post") {
        deleteButton.setAttribute('onclick', `deletePost('${id}')`);
    } else if (type === "category") {
        deleteButton.setAttrbite('onclick', `deleteCategory('${id}')`)
    }

    showDeleteBox.style.display = "flex";
}

function showMore(logged_in_as_user, info_text) {
    // get the categroy index from the dictionary for the share button
    const category_index = JSON.parse(decodeURIComponent(info_text))["index in user"];

    // if the elements already exist, don't create stuff
    const info_button_element_old = document.getElementById('more_box_info');
    const share_button_element_old = document.getElementById('more_box_share');
    const delete_button_element_old = document.getElementById('more_box_share');
    if (info_button_element_old || share_button_element_old || delete_button_element_old) {
        // update the elements
        if (info_button_element_old) {
            // update the info (well, not in all cases, but you know what i mean)
            info_button_element_old.setAttribute("onclick", `showInfo('${info_text}')`);
        }

        if (share_button_element_old) {
            // update the url (well, not in all cases, but you know what i mean)
            share_button_element_old.setAttribute("onclick", `showShare('https://khenzii.dev/blog/user/${username}#${category_index}')`);
        }

        if (delete_button_element_old) {
            // do stuff with the info element here (if you wish to)
        }

        // show and return
        showMoreBox.style.display = "flex";
        shadowEffectStart()
        return
    }


    // define the buttons
    const info_button = `
    <button class="more_button_info" id="more_box_info" onclick="showInfo('${info_text}')">
        <img src="../../../icons/pages/blog/info.png" alt="info button" class="more_button_info_image">
    </button>
    `

    const share_button = `
    <button class="more_button_share" id="more_box_share" onclick="showShare('https://khenzii.dev/blog/user/${username}#${category_index}')">
        <img src="../../../icons/pages/blog/share.png" alt="share button" class="more_button_share_image">
    </button>
    `

    const delete_button = `
    <button class="more_button_delete" id="more_box_delete" onclick="showDelete()">
        <img src="../../../icons/pages/blog/delete.png" alt="delete button" class="more_button_delete_image">
    </button>
    `

    // create the elements
    showMoreBoxButtonContainer.insertAdjacentHTML('beforeend', info_button)
    showMoreBoxButtonContainer.insertAdjacentHTML('beforeend', share_button)
    if (logged_in_as_user) {
        showMoreBoxButtonContainer.insertAdjacentHTML('beforeend', delete_button)
    } else {
        // if not showing the third button, make the first two ones bigger
        const info_button_element = document.getElementById("more_box_info");
        const share_button_element = document.getElementById("more_box_share");

        info_button_element.style.height = "7.5vh";
        share_button_element.style.height = "7.5vh";
    }

    showMoreBox.style.display = "flex";
    shadowEffectStart()
}

function createTheLoginAndRegisterButtons() {
    const line = `
    <hr class="logged_or_not_line">
    `

    const login_button = `
    <button class="login_button" id="login_button" onclick="redirectTo('/blog/login', event)">
        Login
    </button>
    `

    const register_button = `
    <button class="register_button" id="register_button" onclick="redirectTo('/blog/register', event)">
        Register
    </button>
    `

    profile_container.insertAdjacentHTML('beforeend', line)
    profile_container.insertAdjacentHTML('beforeend', login_button)
    profile_container.insertAdjacentHTML('beforeend', register_button)
}

function createTheCategoryAddButton() {
    const button = `
    <button class="category_create_button" id="category_create_button" onclick="showCreateCategoryPopout()">
        <img src="../../../icons/pages/blog/create.png" alt="create button" class="category_create_button_image">
    </button>
    `

    return content_container.insertAdjacentHTML('afterbegin', button)
}

function createTheSettingsButton() {
    const line = `
    <hr class="logged_or_not_line">
    `

    const button = `
    <button class="settings_button" id="settings_button" onclick="redirectTo('/blog/settings', event)">
        <img src="../../../icons/pages/blog/settings.png" alt="settings button" class="settings_button_image">
    </button>
    `
    profile_container.insertAdjacentHTML('beforeend', line)
    profile_container.insertAdjacentHTML('beforeend', button)
}

function createHTMLCategory(title, description, id, empty, logged_in_as_user, index_in_user) {
    var category = ""
    const info = {
        "category id": `${id}`,
        "index in user": `${index_in_user}`
    }

    if (empty) {
        if (logged_in_as_user) {
            var category = `
            <p class="info_text">
                No categories yet! <br> Go ahead, create one =)
            </p>
            `
        } else {
            var category = `
            <p class="info_text">
                No categories yet!
            </p>
            `
        }
    } else {
        if (logged_in_as_user) {
            var category = `
            <li class="category" data-id="${id}" data-index="${index_in_user}">
                <details class="category_details">
                    <summary class="category_title" onclick="getPosts(${id}, false)">
                        ${title}
                    </summary>

                    <p class="description_text">
                        ${description}
                    </p>

                    <button class="post_create_button" id="post_create_button" onclick="showCreatePostPopout(${id})">
                        <img src="../../../icons/pages/blog/create.png" alt="create button" class="post_create_button_image">
                    </button>

                    <hr class="post_line">

                    <ul class="posts" id="${id}_posts">
                
                    </ul>
                </details>

                <div class="category_ui_container">
                    <img src="../../../icons/pages/blog/drag.png" class="category_drag" draggable=true>
                    <button class="category_more" onclick="showMore(${logged_in_as_user}, '${encodeURIComponent(JSON.stringify(info))}')">
                        <img src="../../../icons/pages/blog/more.png" class="category_more_image" draggable=false>
                    </button>
                </div>
            </li>
            `
        } else {
            var category = `
            <li class="category" data-id="${id}" data-index="${index_in_user}">
                <details class="category_details">
                    <summary class="category_title" onclick="getPosts(${id}, false)">
                        ${title}
                    </summary>

                    <p class="description_text">
                        ${description}
                    </p>

                    <hr class="post_line">

                    <ul class="posts" id="${id}_posts">
                
                    </ul>
                </details>
                
                <div class="category_ui_container">
                    <button class="category_more" onclick="showMore(${logged_in_as_user}, '${encodeURIComponent(JSON.stringify(info))}')">
                        <img src="../../../icons/pages/blog/more.png" class="category_more_image" draggable=false>
                    </button>
                </div>
            </li>
            `
        }
    }

    return categories_element.insertAdjacentHTML('afterbegin', category)
}

function createHTMLPost(text_value, created_at, id, category_id, index_in_category) {
    /// check if the post contains a image or video, if so, style them
    // Define a regular expression to match <img> and <video> tags
    const mediaRegex = /<img[^>]*>|<video[^>]*>/g;

    // Replace <img> and <video> tags with modified versions
    const modifiedText = text_value.replace(mediaRegex, (match) => {
        // Check if the matched tag is an <img> or <video>
        if (match.startsWith("<img")) {
            // If it's an <img> tag, add the max-width and height styles
            return match.replace(">", ' style="max-width: 100%; height: auto;" draggable="false" alt="sum image">');
        } else if (match.startsWith("<video")) {
            // If it's a <video> tag, add the max-width and height styles
            return match.replace(">", ' style="max-width: 100%; height: auto;" draggable="false" alt="sum video" controls="true">');
        }
        return match;
    });

    const info = {
        "post id": `${id}`,
        "index in category": `${index_in_category}`,
    }

    const posts_element = document.getElementById(`${category_id}_posts`);
    const post = `
    <div class="post">
        <div class="post_ui">
            <p class="post_created_at">
                ${created_at}
            </p>

            <button class="post_more" onclick="showMore(${logged_in_as_user}, '${encodeURIComponent(JSON.stringify(info))}')">
                <img src="../../../icons/pages/blog/more.png" class="post_more_image" draggable=false>
            </button>
        </div>

        <p class="post_text">
            ${modifiedText}
        </p>

        <hr class="post_line">
     </div>
    `


    if (id > highest_id_posts) {
        highest_id_posts = id

        return posts_element.insertAdjacentHTML('afterbegin', post)
    } else {
        return posts_element.insertAdjacentHTML('beforeend', post)
    }
}


async function getValuesFromServer(username) {
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

closeCreateCategoryPopout.onclick = function () {
    createCategoryPopout.style.display = "none";
    shadowEffectEnd()
    if (reload == true) {
        location.reload();
    }
}

closeCreatePostPopout.onclick = function () {
    createPostPopout.style.display = "none";
    shadowEffectEnd()
    if (reload == true) {
        window.location.replace(`/blog/user/${username}#${reload_category_to_open}`)
        location.reload();
    }
}

closeInfoBox.onclick = function () {
    infoBox.style.display = "none";
    shadowEffectEnd()
    if (reload == true) {
        location.reload();
    }
}

closeShowMoreBox.onclick = function () {
    showMoreBox.style.display = "none";
    shadowEffectEnd()
    if (reload == true) {
        location.reload();
    }
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

closeShowDeleteBox.onclick = function () {
    showDeleteBox.style.display = "none";
}


sureInput.addEventListener("input", function () {
    var value = sureInput.value;

    if (value.toUpperCase() == "Y") {
        deleteButton.classList.remove("no");
    } else {
        deleteButton.classList.add("no");
    }
});

var hash = null
var hashable = false

if (window.location.href.endsWith('/')) {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 2]
} else {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 1]
    var username = username.split("#")[0]

    // get the strings after username
    var after_username = window.location.href.split(username)[1]
    var hash = after_username.split("#")
}

if (!username) { // if didn't get the username correctly
    // using the .replace() method here, because it's ALWAYS synchronus
    window.location.replace("/")
}

if (hash) {
    hash.splice(0, 1) // remove the first index
    // (we don't need this: '' string)

    for (let i = 0; i < hash.length; i++) {
        let hash_int = Number(hash[i])
        if (!hash_int) {
            // if NaN, go to the page without incorrect hashtags
            // (we only support # with indexes (no titles, etc.))
            // using the .replace() method here, because it's ALWAYS syncrhonus
            window.location.replace(`/blog/user/${username}`)
        }
    }

    hashable = true
}

username_paragraph.textContent = username;
document.title = `${username} | khenzii.dev/blog`;

var user_id = ""
var logged_in_as_user = false

getValuesFromServer(username).then(data => {
    if (data == "something went wrong.. :( Error: Something went wrong") {
        infoBoxShow("You got rate limited! The get_user API endpoint responds 80 times / minute.")
        return
    }

    // asign stuff
    pfp_image.src = data.image;
    bio_paragraph.textContent = data.bio_and_links.text_value;
    joined_at_paragraph.textContent = `joined at: ${data.joined_at}`;
    user_id_paragraph.textContent = `id: ${data.user_id}`;
    user_id = data.user_id

    // logged_in_as_user is set to true, if user is the owner of current viewed page
    if (data.logged_in_as_user) {
        logged_in_as_user = true
        createTheCategoryAddButton()
        createTheSettingsButton()
    } else {
        // logged_in is set to false, if the client is completely not logged in (no cookie)
        if (!data.logged_in) {
            createTheLoginAndRegisterButtons()
        }
    }

    if (data.categories == "404") {
        createHTMLCategory("", "", "", true, data.logged_in_as_user, data.index_in_user)
    } else {
        // sort the categories by index_in_user (in reverse)
        data.categories.sort((a, b) => a.index_in_user - b.index_in_user);

        for (let i = 0; i < data.categories.length; i++) { // loop through all of the categories
            createHTMLCategory(data.categories[i].title, data.categories[i].description, data.categories[i].id, false, data.logged_in_as_user, data.categories[i].index_in_user)
        }


        let draggedElement = null;
        let overElement = null

        for (let i = 0; i < categories_element.children.length; i++) {
            element = categories_element.children[i]

            if (hashable) {
                for (let j = 0; j < hash.length; j++) {
                    // if incorrect hash, resend user to page without hash
                    if ((hash[j] > data.categories.length || hash[j] < 1) && hash[j] != -1) {
                        window.location.replace(`/blog/user/${username}`)
                    }

                    // open if the hash match, or if hash -1
                    if (element.getAttribute("data-index") == hash[j] || hash[j] == -1) {
                        getPosts(element.getAttribute("data-id"), false)
                        var details_element = categories_element.children[i].querySelector('.category_details');
                        details_element.open = true
                    }
                }
            }

            element.addEventListener('dragstart', function (event) {
                draggedElement = this;
                draggedElement.classList.add('dragging');
            });

            element.addEventListener('dragover', function (event) {
                event.preventDefault();
                overElement = this;
            });

            element.addEventListener('dragend', function (event) {
                draggedElement.classList.remove('dragging');
            });

            element.addEventListener('drop', function (event) {
                event.preventDefault();

                // remove the dragging class
                draggedElement.classList.remove('dragging')

                /// Switch places
                // create a placeholder
                let temp = document.createElement('div');
                // put the placeholder before dragged element
                categories_element.insertBefore(temp, draggedElement);
                // put the dragged element before target element 
                categories_element.insertBefore(draggedElement, overElement);
                // put the target element before the placeholder
                categories_element.insertBefore(overElement, temp);
                // get rid of the placeholder
                categories_element.removeChild(temp);


                const first_index = draggedElement.getAttribute("data-index")
                const second_index = overElement.getAttribute("data-index")

                change_category_index(first_index, second_index).then(data => {
                    if (reload == true) {
                        location.reload();
                    } else {
                        infoBoxShow(data)
                        reload = true
                    }
                })
            });
        }
    }
});
const profile_container = document.getElementById("profile_container")
const username_paragraph = document.getElementById("username")
const pfp_image = document.getElementById("pfp");
const bio_paragraph = document.getElementById("bio");
const joined_at_paragraph = document.getElementById("joined_at");
const user_id_paragraph = document.getElementById("user_id");
const content_container = document.getElementById(`content_container`);
const categories_element = document.getElementById("categories");
const shadowEffect = document.getElementById("shadowEffect");
const createCategoryPopout = document.getElementById("create_category");
const closeCreateCategoryPopout = document.getElementById("create_category_close");
const categoryTitleInput = document.getElementById("category_title_input");
const categoryDescriptionInput = document.getElementById("category_description_input");
const createPostPopout = document.getElementById("create_post");
const closeCreatePostPopout = document.getElementById("create_post_close");
const postInput = document.getElementById("post_input");


var first_time = {}
var how_much_times = {}

var highest_id_posts = -1
var highest_id_categories = -1

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

async function getPosts(category_id, clicked_button) {
    if (first_time[category_id] == false && !clicked_button) {
        console.log("got already, not getting!")
        return
    }

    first_time[category_id] = false
    console.log(first_time)
    console.log("first time ^")

    if (how_much_times[category_id] == null) {
        console.log("empty!")
        how_much_times[category_id] = 1
    }

    console.log(how_much_times[category_id])

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
    console.log(posts)

    removeShowMoreButtonHTML(category_id)

    for (let i = 0; i < posts.length; i++) {
        console.log(posts[i].text_value)
        console.log(posts[i].created_at)

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

    categoryCreateInfo(text)
}

async function createPost() {
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

    postCreateInfo(text)
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

function createTheCategoryAddButton() {
    const button = `
    <button class="category_create_button" id="category_create_button" onclick="showCreateCategoryPopout()">
        <img src="../../../icons/pages/blog/create.png" alt="create button" class="category_create_button_image">
    </button>
    `

    return content_container.insertAdjacentHTML('afterbegin', button)
}

function createTheSettingsButton() {
    const button = `
    <button class="settings_button" id="settings_button" onclick="redirectTo('/blog/settings', event)">
        <img src="../../../icons/pages/blog/settings.png" alt="settings button" class="settings_button_image">
    </button>
    `

    return profile_container.insertAdjacentHTML('beforeend', button)
}

function createHTMLCategory(title, description, id, empty, logged_in) {
    var category = ""

    if (empty) {
        if (logged_in) {
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
        if (logged_in) {
            var category = `
            <li class="category">
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

                <img src="../../../icons/pages/blog/drag.png" class="category_drag" draggable=true>
            </li>
            `
        } else {
            var category = `
            <li class="category">
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
            </li>
            `
        }
    }


    if (id > highest_id_categories) {
        highest_id_categories = id

        console.log(`putting to the top: ${title}`)

        return categories_element.insertAdjacentHTML('afterbegin', category)
    } else {
        return categories_element.insertAdjacentHTML('beforeend', category)
    }
}

function createHTMLPost(text_value, created_at, id, category_id, index_in_category) {
    const posts_element = document.getElementById(`${category_id}_posts`);
    const post = `
    <div class="post">
        <p class="post_index_in_category">
            post index in category: ${index_in_category}
        </p>

        <div class="post_info">
            <p class="post_created_at">
                ${created_at}
            </p>

            <p class="post_id">
                post id: ${id}
            </p>
        </div>

        <p class="post_text">
            ${text_value}
        </p>

        <hr class="post_line">
     </div>
    `

    console.log(highest_id_posts)
    console.log(id)
    console.log("before if")
    if (id > highest_id_posts) {
        highest_id_posts = id

        console.log(`putting to the top: ${text_value}`)

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
}

closeCreatePostPopout.onclick = function () {
    createPostPopout.style.display = "none";
    shadowEffectEnd()
}

if (window.location.href.endsWith('/')) {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 2]
} else {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 1]
}

username_paragraph.textContent = username;
document.title = `${username} | khenzii.dev/blog`;

var user_id = ""

getValuesFromServer(username).then(data => {
    console.log(data)
    console.log(data.image)
    console.log(data.user_id)
    console.log(data.bio_and_links)
    console.log(data.categories)
    console.log(data.logged_in)

    // asign stuff
    pfp_image.src = data.image;
    bio_paragraph.textContent = data.bio_and_links.text_value;
    joined_at_paragraph.textContent = `joined at: ${data.joined_at}`;
    user_id_paragraph.textContent = `id: ${data.user_id}`;
    user_id = data.user_id

    if (data.logged_in) {
        createTheCategoryAddButton()
        createTheSettingsButton()
    }

    if (data.categories == "404") {
        createHTMLCategory("", "", "", true, data.logged_in)
    } else {
        console.log(data.categories)

        for (let i = 0; i < data.categories.length; i++) { // loop through all of the categories
            createHTMLCategory(data.categories[i].title, data.categories[i].description, data.categories[i].id, false, data.logged_in)
        }


        let draggedElement = null;
        let overElement = null

        for(let i = 0; i < categories_element.children.length; i++) {
            element = categories_element.children[i]
            console.log(element)

            element.addEventListener('dragstart', function (event) {
                draggedElement = this;
                draggedElement.classList.add('dragging');
                console.log(draggedElement)
            });

            element.addEventListener('dragover', function (event) {
                event.preventDefault();
                overElement = this;
            });

            element.addEventListener('dragend', function (event) {
                element.classList.remove('dragging');
            });

            element.addEventListener('drop', function (event) {
                event.preventDefault();

                // remove the dragging class
                draggedElement.classList.remove('dragging')

                // Switch places
                let temp = document.createElement('div');
                categories_element.insertBefore(temp, draggedElement);
                categories_element.insertBefore(draggedElement, overElement);
                categories_element.insertBefore(overElement, temp);
                categories_element.removeChild(temp);
            });
        }
    }
});
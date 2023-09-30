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


var first_time = {}
var how_much_times = {}

var highest_id_posts = -1

var reload = false
var reload_category_to_open = null
var category_create_button_clickable = true
var post_create_button_clickable = true

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
    reload = true
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
    if(category_create_button_clickable == false) {
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
    if(post_create_button_clickable == false) {
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

function createHTMLCategory(title, description, id, empty, logged_in, index_in_user) {
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

                <img src="../../../icons/pages/blog/drag.png" class="category_drag" draggable=true>
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
            </li>
            `
        }
    }

    return categories_element.insertAdjacentHTML('afterbegin', category)
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
    if(reload == true) {
        location.reload();
    }
}

closeCreatePostPopout.onclick = function () {
    createPostPopout.style.display = "none";
    shadowEffectEnd()
    if(reload == true) {
        window.location.replace(`/blog/user/${username}#${reload_category_to_open}`)
        location.reload();
    }
}

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

if(!username) { // if didn't get the username correctly
    // using the .replace() method here, because it's ALWAYS synchronus
    window.location.replace("/")
}

if(hash) {
    hash.splice(0, 1) // remove the first index
    // (we don't need this: '' string)

    for(let i = 0; i < hash.length; i++) {
        let hash_int = Number(hash[i])
        if(!hash_int) {
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

getValuesFromServer(username).then(data => {
    // asign stuff
    pfp_image.src = data.image;
    bio_paragraph.textContent = data.bio_and_links.text_value;
    joined_at_paragraph.textContent = `joined at: ${data.joined_at}`;
    user_id_paragraph.textContent = `id: ${data.user_id}`;
    user_id = data.user_id

    if (data.logged_in) {
        createTheCategoryAddButton()
        createTheSettingsButton()
    } else {
        createTheLoginAndRegisterButtons()
    }

    if (data.categories == "404") {
        createHTMLCategory("", "", "", true, data.logged_in, data.index_in_user)
    } else {
        // sort the categories by index_in_user (in reverse)
        data.categories.sort((a, b) => a.index_in_user - b.index_in_user);

        for (let i = 0; i < data.categories.length; i++) { // loop through all of the categories
            createHTMLCategory(data.categories[i].title, data.categories[i].description, data.categories[i].id, false, data.logged_in, data.categories[i].index_in_user)
        }


        let draggedElement = null;
        let overElement = null

        for(let i = 0; i < categories_element.children.length; i++) {
            element = categories_element.children[i]

            if(hashable) {
                for(let j = 0; j < hash.length; j++) {
                    // if incorrect hash, resend user to page without hash
                    if((hash[j] > data.categories.length || hash[j] < 1) && hash[j] != -1) {
                        window.location.replace(`/blog/user/${username}`)
                    }

                    // open if the hash match, or if hash -1
                    if(element.getAttribute("data-index") == hash[j] || hash[j] == -1) {
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
                    // console.log(data) // handle the server response in anyway if you wish
                    // if response status code == 200 the data will be "Success!"

                    if(reload == true) {
                        location.reload();
                    }
                })
            });
        }
    }
});
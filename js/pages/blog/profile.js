const username_paragraph = document.querySelector(".username");
const pfp_image = document.getElementById("pfp");
const bio_paragraph = document.getElementById("bio");
const joined_at_paragraph = document.getElementById("joined_at");
const user_id_paragraph = document.getElementById("user_id");
const categories_element = document.getElementById("categories");
const shadowEffect = document.getElementById("shadowEffect");
const createCategoryPopout = document.getElementById("create_category");
const closeCreateCategoryPopout = document.getElementById("create_category_close");
const categoryTitleInput = document.getElementById("category_title_input");
const categoryDescriptionInput = document.getElementById("category_description_input");
const createPostPopout = document.getElementById("create_post");
const closeCreatePostPopout = document.getElementById("create_post_close");
const postInput = document.getElementById("post_input");


function categoryCreateInfo(text) {
    const info_text = `
    <p class="create_category_info_text">${text}</p>
    `

    return createCategoryPopout.insertAdjacentHTML('beforeend', info_text)
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

function showCreatePostPopout() {
    createPostPopout.style.display = "flex";
    shadowEffectStart()
}

function createTheCategoryAddButton() {
    const content_container = document.getElementById(`content_container`);

    const button = `
    <button class="category_create_button" id="category_create_button" onclick="showCreateCategoryPopout()">
        <img src="../../../icons/pages/blog/create.png" alt="create button" class="category_create_button_image">
    </button>
    `

    return content_container.insertAdjacentHTML('afterbegin', button)
}

// HTML elements here
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
        if(logged_in) {
            var category = `
            <li class="category">
                <details>
                    <summary class="category_title">
                        ${title}
                    </summary>

                    <p class="description_text">
                        ${description}
                    </p>

                    <center>
                        <button class="post_create_button" id="post_create_button" onclick="showCreatePostPopout()">
                            <img src="../../../icons/pages/blog/create.png" alt="create button" class="post_create_button_image">
                        </button>
                    </center>

                    <hr class="post_line">

                    <ul class="posts" id="${id}_posts">
                
                    </ul>
                </details>
            </li>
            `
        } else {
            var category = `
            <li class="category">
                <details>
                    <summary class="category_title">
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

    return categories_element.insertAdjacentHTML('beforeend', category);
}

function createPost(text_value, posts_id) {
    const posts_element = document.getElementById(`${posts_id}_posts`);
    const post = `
    <div class="post">
        <p class="post_text">
            ${text_value}
        </p>
     </div>
    `

    return posts_element.insertAdjacentHTML('beforeend', post)
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

    if(data.logged_in) {
        createTheCategoryAddButton()
    }

    if (data.categories == "404") {
        createHTMLCategory("", "", "", true, data.logged_in)
    } else {
        for(let i = 0; i < data.categories.length; i++) { // loop through all of the categories
            console.log(data.categories[i].title)
            console.log(data.categories[i].description)
            console.log(data.categories[i].id)

            createHTMLCategory(data.categories[i].title, data.categories[i].description, data.categories[i].id, false, data.logged_in)
        }
    }
});
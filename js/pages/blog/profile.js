const username_paragraph = document.querySelector(".username");
const pfp_image = document.getElementById("pfp");
const bio_paragraph = document.getElementById("bio");
const categories_element = document.getElementById("categories");
const shadowEffect = document.getElementById("shadowEffect");
const createCategoryPopout = document.getElementById("create_category");
const closeCreateCategoryPopout = document.getElementById("create_category_close");
const categoryTitleInput = document.getElementById("category_title_input");
const categoryDescriptionInput = document.getElementById("category_description_input");

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
function createCategory(title, description, id, empty, logged_in) {
    var category = ""

    if (empty) {
        if (logged_in) {
            createTheCategoryAddButton()

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
        createTheCategoryAddButton()

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

if (window.location.href.endsWith('/')) {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 2]
} else {
    var username = window.location.href.split("/")[window.location.href.split("/").length - 1]
}

username_paragraph.textContent = username;
document.title = `${username} | khenzii.dev/blog`;


console.log(username)
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

    if (data.categories == "404") {
        createCategory("", "", "", true, data.logged_in)
    } else {
        // create categories from the db here
    }
});
const centered_container = document.getElementById("centered_container");
const edit_pfp_popout = document.getElementById("edit_pfp");
const edit_username_popout = document.getElementById("edit_username");
const edit_bio_popout = document.getElementById("edit_bio");
const close_edit_pfp_popout = document.getElementById("edit_pfp_close");
const close_edit_username_popout = document.getElementById("edit_username_close");
const close_edit_bio_popout = document.getElementById("edit_bio_close");
const pfp_image = document.getElementById("pfp");
const username_paragraph = document.getElementById("username");
const bio_paragraph = document.getElementById("bio");
const shadowEffect = document.getElementById("shadowEffect");
const usernameInput = document.getElementById("edit_username_input");
const bioInput = document.getElementById("edit_bio_input");
const edit_pfp_file_input = document.getElementById("edit_pfp_file_input");
const edit_pfp_drop = document.getElementById("edit_pfp_drop");


var user_id = ""

function HTMLpfpInfo(text) {
    const info_text = `
    <p class="info_text">${text}</p>
    `

    return edit_pfp_popout.insertAdjacentHTML('beforeend', info_text)
}

function HTMLusernameInfo(text) {
    const info_text = `
    <p class="info_text">${text}</p>
    `

    return edit_username_popout.insertAdjacentHTML('beforeend', info_text)
}

function HTMLbioInfo(text) {
    const info_text = `
    <p class="info_text">${text}</p>
    `

    return edit_bio_popout.insertAdjacentHTML('beforeend', info_text)
}

function showEditPfpPopout() {
    edit_pfp_popout.style.display = "flex";
    shadowEffectStart()
}

function showEditUsernamePopout() {
    edit_username_popout.style.display = "flex";
    shadowEffectStart()
}

function showEditBioPopout() {
    edit_bio_popout.style.display = "flex";
    shadowEffectStart()
}

function shadowEffectStart() {
    shadowEffect.style.display = "block";
}

function shadowEffectEnd() {
    shadowEffect.style.display = "none";
}

function createTheGoBackButtonHTML(username) {
    const button = `
    <button class="back_to_profile_button" onclick="redirectTo('/blog/user/${username}', event)">
        <img src="../../../icons/pages/blog/pfp_placeholder.png" alt="edit pfp button" class="back_to_profile_button_image">
    </button>
    `

    return centered_container.insertAdjacentHTML('afterbegin', button)
} 

async function getValuesFromServer() {
    return fetch('/blog/api/get_user_settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
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

async function changePfp() {
    const editPfpValue = edit_pfp_file_input.files[0];

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('new_pfp', editPfpValue);

    const response = await fetch('/blog/api/change_pfp', {
        method: 'POST',
        body: formData, // had to use formData instead of JSON.stringify
        // because we're dealing with images
    });
    
    var text = await response.text();

    HTMLpfpInfo(text)
}

async function changeUsername() {
    // change the name of the old cookie (to "<name>_old")
    // Get the value of the old cookie
    let oldCookieValue = document.cookie.split('; ').find(row => row.startsWith('jwt_access_cookie='))?.split('=')[1];

    // set a new cookie with a old value
    document.cookie = `jwt_access_cookie_old=${oldCookieValue}; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/`;

    // Delete the old cookie
    document.cookie = "jwt_access_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    
    console.log("renamed the cookie!")

    const editUsernameInputValue = usernameInput.value;

    const data = {
        user_id: user_id,
        text_value: editUsernameInputValue
    };

    const response = await fetch('/blog/api/change_username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    // remove the old access token (don't even try getting rid of 
    // this line, khenzii.dev is using a blacklist on the server side =))
    document.cookie = "jwt_access_cookie_old=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("removed the cookie!")

    var text = await response.text();

    HTMLusernameInfo(text)
}

async function changeBio() {
    const editBioInputValue = bioInput.value;

    const data = {
        user_id: user_id,
        text_value: editBioInputValue
    };

    const response = await fetch('/blog/api/change_bio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    var text = await response.text();

    HTMLbioInfo(text)
}

function createTheGoBackButtonHTML(username) {
    const button = `
    <button class="back_to_profile_button" onclick="redirectTo('/blog/user/${username}', event)">
        <img src="../../../icons/pages/blog/pfp_placeholder.png" alt="edit pfp button" class="back_to_profile_button_image">
    </button>
    `

    return centered_container.insertAdjacentHTML('afterbegin', button)
} 

close_edit_pfp_popout.onclick = function () {
    edit_pfp_popout.style.display = "none";
    shadowEffectEnd()
}

close_edit_username_popout.onclick = function () {
    edit_username_popout.style.display = "none";
    shadowEffectEnd()
}

close_edit_bio_popout.onclick = function () {
    edit_bio_popout.style.display = "none";
    shadowEffectEnd()
}

function changePreview(element) {
    var file = element.files[0];
    const image_HTML = `
    <img class="pfp_preview" id="pfp_preview">
    `

    var image = document.getElementById("pfp_preview")
    if(image != null) {
        image.src = URL.createObjectURL(file);
    } else {
        edit_pfp_popout.insertAdjacentHTML('beforeend', image_HTML)
        var image = document.getElementById("pfp_preview")
        image.src = URL.createObjectURL(file);
    }
}

edit_pfp_file_input.addEventListener('change', function() {
    changePreview(edit_pfp_file_input)
})

function onDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    edit_pfp_file_input.files = e.dataTransfer.files;
    changePreview(edit_pfp_file_input)
}

edit_pfp_drop.addEventListener('dragenter', onDragEnter, false);
edit_pfp_drop.addEventListener('dragover', onDragOver, false);
edit_pfp_drop.addEventListener('drop', onDrop, false);

getValuesFromServer().then(data => {
    console.log(data)

    // asign stuff
    pfp_image.src = data.image;
    bio_paragraph.textContent = data.bio_and_links.text_value;
    // implement the links later
    user_id = data.user_id

    // do stuff with the username
    username_paragraph.textContent = data.username; // change the username paragraph
    document.title = `${data.username} | khenzii.dev/blog/settings`; // change the tab's title
    createTheGoBackButtonHTML(data.username) // create a go back to profile button
});
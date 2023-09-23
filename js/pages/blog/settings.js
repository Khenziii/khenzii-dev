const centered_container = document.getElementById("centered_container");
const edit_pfp_popout = document.getElementById("edit_pfp")
const edit_username_popout = document.getElementById("edit_username")
const edit_bio_popout = document.getElementById("edit_bio")
const close_edit_pfp_popout = document.getElementById("edit_pfp_close");
const close_edit_username_popout = document.getElementById("edit_username_close");
const close_edit_bio_popout = document.getElementById("edit_bio_close");
const pfp_image = document.getElementById("pfp");
const username_paragraph = document.getElementById("username");
const bio_paragraph = document.getElementById("bio");
const shadowEffect = document.getElementById("shadowEffect")
const usernameInput = document.getElementById("edit_username_input")
const bioInput = document.getElementById("edit_bio_input")


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
    const editBioInputValue = bioInput.value;

    const data = {
        user_id: user_id,
        text_value: editBioInputValue
    };

    const response = await fetch('/blog/api/create_category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    var text = await response.text();

    HTMLpfpInfo(text)
}

async function changeUsername() {
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
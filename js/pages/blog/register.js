info_paragraph = document.getElementById("info_text");

async function check_if_correct() {
    const email_input = document.querySelector(".input_email");
    const username_input = document.querySelector(".input_username");
    const password_input = document.querySelector(".input_password");

    const email_input_value = email_input.value;
    const username_input_value = username_input.value;
    var password_input_value = password_input.value;

    const data = {
        email: email_input_value,
        username: username_input_value,
        password: password_input_value
    };

    return fetch('/blog/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).catch(error => {
        // Handle any error that occurred during the request
        return error
    });
}

function register() {
    check_if_correct().then(message => {
        info_paragraph.innerHTML = message;
        info_paragraph.style.opacity = 1;
    });
}
// get some elements
const logo_image = document.getElementById("zsllolcuplogo");
const link_preview = document.getElementById("share_link_preview");
const stroke_hex_input = document.getElementById("stroke_hex_input");
const fill_hex_input = document.getElementById("fill_hex_input");

// define sum variables
const current_url = window.location.href
var editable_url = "https://khenzii.dev/zsl/logo"
var number_of_hexes = -1
var times_copied = 0

// 0: stroke color; 1: fill color;
var hexes = current_url.split("/zsl/logo")[1]
var hexes = hexes.split("/")
var hexes = hexes.filter(function (item) {
    return item !== '';
});

number_of_hexes = hexes.length;
if (number_of_hexes == 1) {
    // make the second hex have the same value as the first one
    hexes[1] = hexes[0]
}


/// change the image's color
function change_color(hex_1, hex_2) {
    // change the color of the logo
    const paths = logo_image.querySelectorAll('path');
    paths.forEach(path => {
        if (path.parentElement.id === "teeth" || path.parentElement.id === "hair" || path.id === "face" || path.id === "mouth") {
            path.setAttribute('stroke', `#${hex_1}`);
        } else {
            path.setAttribute('stroke', `#${hex_2}`);
            path.setAttribute('fill', `#${hex_2}`);
        }
    });

    change_favicon()
}

/// update the copy preview and the image's colors
function updateLinkPreview(text) {
    link_preview.textContent = text;
    change_color(hexes[0], hexes[1])
}

/// set the logo as a favicon
function change_favicon() {
    // get the string
    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(logo_image);
    let encodedSvg = encodeURIComponent(svgStr);
    let faviconUrl = `data:image/svg+xml, ${encodedSvg}`
    
    // set as favicon
    let linkElement = document.querySelector('link[rel="icon"]');
    linkElement.setAttribute('rel', 'icon');
    linkElement.setAttribute('href', faviconUrl);
}

/// get random hex value
function getRandomHex() {
    // Define the characters that can be used in a hex string
    const hexChars = "0123456789abcdef";

    let hexString = "";

    // Generate 6 random characters
    for (let i = 0; i < 6; i++) {
        // Get a random index within the range of valid characters
        const randomIndex = Math.floor(Math.random() * hexChars.length);

        // Append the randomly selected character to the hex string
        hexString += hexChars.charAt(randomIndex);
    }

    return hexString;
}

/// randomize the image colours
function randomize() {
    // get random hex'es
    const hex_1 = getRandomHex()
    const hex_2 = getRandomHex()

    // change the logo color
    change_color(hex_1, hex_2)

    // store the hexes
    hexes[0] = hex_1
    hexes[1] = hex_2

    /// update other HTML elements
    // update the link preview
    updateLinkPreview(`${editable_url}/${hexes[0]}/${hexes[1]}`)

    // update the inputs automatically
    stroke_hex_input.value = hexes[0];
    fill_hex_input.value = hexes[1];
}

/// copy to the cliipboard
function copyToClipboard(parent_id) {
    const parent_element = document.getElementById(parent_id);
    const info_text = document.getElementById("info_text")
    const text = link_preview.textContent;

    navigator.clipboard.writeText(text).then(() => {
        if (times_copied == 0) {
            var message = "Copied to the clipboard!";
        } else {
            var message = `Copied to the clipboard! (x${times_copied + 1})`;
        }
        times_copied++;

        // if the element already exists
        if (info_text) {
            info_text.textContent = message;
        } else {
            // if not, create it
            const info_text_share = `
            <p class="text" id="info_text" style="margin-top: 1vh;">
                ${message}
            </p>
            `

            parent_element.insertAdjacentHTML('beforeend', info_text_share)
        }
    }, () => {
        if (times_copied == 0) {
            var message = "Failed to copy to the clipboard! :(";
        } else {
            var message = `Failed to copy to the clipboard! :( (x${times_copied + 1})`;
        }
        times_copied++;

        // if the element already exists
        if (info_text) {
            info_text.textContent = message;
        } else {
            // if not, create it
            const info_text_share = `
            <p class="text" id="info_text_share" style="margin-top: 1vh;">
                ${message}
            </p>
            `

            parent_element.insertAdjacentHTML('beforeend', info_text_share)
        }
    });
}


/// on stroke hex input 
stroke_hex_input.addEventListener("input", function () {
    // change the value stored
    var value = stroke_hex_input.value;
    hexes[0] = value

    // update the image
    updateLinkPreview(`${editable_url}/${hexes[0]}/${hexes[1]}`)
})

/// on fill hex input
fill_hex_input.addEventListener("input", function () {
    // change the value stored
    var value = fill_hex_input.value;
    hexes[1] = value

    // update the image
    updateLinkPreview(`${editable_url}/${hexes[0]}/${hexes[1]}`)
})


/// if no hexes specified in the url, show the current logo
if (number_of_hexes == 0) {
    // define the default hexes
    hexes[0] = "00b374"
    hexes[1] = "1affaf"

    // update the link preview
    updateLinkPreview(`${editable_url}/${hexes[0]}/${hexes[1]}`)

    // update the inputs automatically
    stroke_hex_input.value = hexes[0];
    fill_hex_input.value = hexes[1];
} else { // if hexes specified, show the gotten hexes
    // update the link preview
    updateLinkPreview(`${editable_url}/${hexes[0]}/${hexes[1]}`)

    // update the inputs automatically
    stroke_hex_input.value = hexes[0];
    fill_hex_input.value = hexes[1];
}
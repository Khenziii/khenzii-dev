// get some elements
const logo_image = document.getElementById("zsllolcuplogo");

// define sum variables
const current_url = window.location.href
var number_of_hexes = 2

if(current_url.split('/').length == 7) {
    number_of_hexes = 2
} else if (current_url.split('/').length == 6) {
    number_of_hexes = 1
} else {
    number_of_hexes = 0
}



/// if on a hex route
// set the favicon of the webpage to the sent image

// show case the sent image
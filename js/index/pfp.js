const stuff_list = ["Python", "JavaScript", "CSS", "HTML", "C#", "Unity", "Bash", "C++", "Java", "Flutter", "Kotlin", "Swift"]
var pfp_element = document.getElementById("pfp")


function getTranslateYValue(source_element, target_element) {
    // get the position and dimensions of the source element
    var rect = source_element.getBoundingClientRect();

    // get the dimensions of the target element
    var targetHeight = target_element.offsetHeight;

    // calculate the translateY value
    var translateYValue = rect.top - targetHeight / 2;

    return translateYValue;
}

function getElementsHeight(element) {
    const computedStyle = window.getComputedStyle(element);
    const widthInPixels = computedStyle.getPropertyValue('height');

    const widthInPixelsNumberWihtoutEnding = widthInPixels.split("px")[0]

    return widthInPixelsNumberWihtoutEnding
}

function getElementsWidth(element) {
    const computedStyle = window.getComputedStyle(element);
    const widthInPixels = computedStyle.getPropertyValue('width');

    const widthInPixelsNumberWihtoutEnding = widthInPixels.split("px")[0]

    return widthInPixelsNumberWihtoutEnding
}

function putAElementOnAnotherElement(source_element, target_element) {
    // get the position of the source element
    var rect = source_element.getBoundingClientRect();
    var sourcePosition = {
        x: rect.left,
        y: rect.top
    };

    // set the position of the target element
    target_element.style.left = sourcePosition.x + 'px';
    target_element.style.top = sourcePosition.y + 'px';
}

function getAnotherWord(list) {
    const random_index = Math.floor(Math.random() * list.length);
    const word = list[random_index]
    return word
}

function getText(words) {
    text = ""

    for(let i = 0; i < words; i++){
        text += getAnotherWord(stuff_list)
        text += " "
    }

    return text
}

function createNewParagraph(text, source_element, use_deafult_css) {
    // create a new paragraph
    var paragraph = document.createElement("p");

    if (use_deafult_css == true) {
        // some stuff to make the text look good
        paragraph.style.color = "#ebd4f1"; // var(--text);
        paragraph.style.fontFamily = "Montserrat";
        paragraph.style.fontWeight = 400;
        paragraph.style.fontSize = "1rem";

        // make it fit nicely inside of the pfp element
        paragraph.style.wordBreak = "break-all"
        paragraph.style.overflow = "hidden"

        var translateYValue = getTranslateYValue(source_element, paragraph);
        paragraph.style.transform = `translateY(-${translateYValue}px)`;

        const width = getElementsWidth(source_element)
        const height = getElementsHeight(source_element)

        paragraph.style.width = `${width}px`;
        paragraph.style.height = `${height}px`;
    }

    // some positioning stuff
    paragraph.style.position = "absolute"; // allow the putAElementOnAnotherElement() function to set the postition of the element
    paragraph.style.zIndex = -1; // put the text under pfp

    // place the text LITERALLY at the pfp
    putAElementOnAnotherElement(source_element, paragraph)

    // change the paragraphs text content
    paragraph.textContent = text;

    // append the element to pfp
    source_element.parentNode.appendChild(paragraph);

    // return the paragraph object
    return paragraph;
}

function animation() {
    if (mobile) {
        return
    }
    var text = getText(250)
    var paragraph = createNewParagraph(text, pfp_element, true);

    var counter = 0
    document.addEventListener('mousemove', (event) => {
        counter += 1

        if(counter == 10) {
            var text = getText(250)
            paragraph.textContent = text;

            counter = 0
        }
    });
}

var mobile = false
const computedStyle = window.getComputedStyle(pfp_element);
if (computedStyle.display === 'none') {
    mobile = true
}

animation()
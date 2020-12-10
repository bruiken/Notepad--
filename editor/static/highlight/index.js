// Is set to true when a request is outgoing to the python host
var isRequesting = false;
// Is set to true when highlighting is requested
var requestHighlight = false;

/**
 * Loaded on page load
 * Set the event listeners to process syntax highlighting and synchronize the two areas (syntax highlighting + actual text)
 */
$(() => {
    var textArea = document.getElementById('textArea');
    var displayArea = document.getElementById('highlight-area');
    displayArea.innerHTML = restoreText(textArea);

    textArea.addEventListener("scroll", function () {
        equalize_scrolls(displayArea, textArea);
    });

    textArea.addEventListener("input", function () {
        equalize_scrolls(displayArea, textArea);
        processPost(this);
    });

    textArea.addEventListener("blur", function () {
        equalize_scrolls(displayArea, textArea);
    });

    $(document).bind('textChanged', () => {
        equalize_scrolls(displayArea, textArea);
        processPost(textArea);
    });
    initialize_stylesheet();
});

/**
 * Initialize the editor theme
 */
function initialize_stylesheet() {
    var chosenTheme = 'default';
    var savedTheme = localStorage.getItem('editorTheme')
    if (savedTheme) {
        chosenTheme = savedTheme;
    }
    var data = {
        'theme': chosenTheme
    };
    $.post("/editor/highlight/style", data, function (data, response) {
        if (response === "success") {
            document.getElementById('editorStylesheet').innerHTML = data;
        }
    });
}

/**
 * Equalize the scroll between the display area (used for syntax highlighting) and the text area
 * @param {div} displayArea 
 * @param {textarea} textArea 
 */
function equalize_scrolls(displayArea, textArea) {
    displayArea.scrollTop = textArea.scrollTop;
    displayArea.scrollLeft = textArea.scrollLeft;
}

/**
 * Reprocess the syntax highlighting when a different language is chosen
 */
function selectedLanguage() {
    var textArea = document.getElementById('textArea');
    processPost(textArea);
}

/**
 * Process the syntax highlighting by sending it to the python host
 * Make sure that we do not request too many times in a short amount
 * @param {textarea} textarea 
 */
function processPost(textarea) {
    if (isRequesting) {
        requestHighlight = true;
        return;
    }
    isSaved = textarea.value == savedText;
    var displayArea = document.getElementById("highlight-area");
    var language = document.getElementById("languageSelect");
    const data = {
        language: language.value,
        text: textarea.value
    };
    $.post("/editor/highlight", data, function (data, response) {
        isRequesting = false;
        if (response === "success") {
            previousText = displayArea.innerHTML;
            displayArea.innerHTML = data.replace(/\n$/g, '\n\n\n');
        }
        if (requestHighlight) {
            requestHighlight = false;
            processPost(textarea);
        } 
    });
    isRequesting = true;
}


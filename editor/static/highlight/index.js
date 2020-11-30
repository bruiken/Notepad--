var isRequesting = false;
var requestHighlight = false;

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

function equalize_scrolls(displayArea, textArea) {
    displayArea.scrollTop = textArea.scrollTop;
    displayArea.scrollLeft = textArea.scrollLeft;
}

function selectedLanguage() {
    var textArea = document.getElementById('textArea');
    processPost(textArea);
}

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


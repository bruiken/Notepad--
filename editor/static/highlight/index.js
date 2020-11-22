var isRequesting = false;
var requestHighlight = false;
var currentItem = 'textArea';

$(() => {
    var backArea = document.querySelector('.backArea');
    var textArea = document.getElementById(currentItem);
    var displayArea = document.querySelector('.displayArea');
    displayArea.innerHTML = restoreText(textArea);

    textArea.addEventListener("scroll", function () {
        backArea.scrollTop = textArea.scrollTop;
        backArea.scrollLeft = textArea.scrollLeft;
    });

    textArea.addEventListener("input", function () {
        processPost(this);
    });

    $(document).bind('fileLoad_done', () => {
        processPost(textArea);
    });
    processPost(textArea);
});

function selectedLanguage() {
    var textArea = document.getElementById(currentItem);
    processPost(textArea);
}

function processPost(textarea) {
    if (isRequesting) {
        requestHighlight = true;
        return;
    }
    isSaved = textarea.value == savedText;
    var displayArea = document.querySelector(".displayArea");
    var language = document.getElementById("languageSelect");
    const data = {
        language: language.value,
        text: textarea.value
    };
    $.post("/editor/highlight", data, function (data, response) {
        isRequesting = false;
        if (response === "success") {
            previousText = displayArea.innerHTML;
            displayArea.innerHTML = data.replace(/\n$/g, '\n\n');
        }
        if (requestHighlight) {
            requestHighlight = false;
            processPost(textarea);
        } 
    });
    isRequesting = true;
}
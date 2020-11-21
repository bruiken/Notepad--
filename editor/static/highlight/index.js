$(() => {
    var backArea = document.querySelector('.backArea');
    var textArea = document.getElementById('textArea');
    var displayArea = document.querySelector('.displayArea');
    displayArea.innerHTML = restoreText(textArea)

    textArea.addEventListener("scroll", function () {
        backArea.scrollTop = textArea.scrollTop;
        backArea.scrollLeft = textArea.scrollLeft;
    });

    textArea.addEventListener("input", function () {
        processPost(this);
    });
});

function selectedLanguage() {
    var textArea = document.getElementById('textArea');
    processPost(textArea);
}

function processPost(textarea) {
    isSaved = textarea.value == savedText;
    var displayArea = document.querySelector(".displayArea");
    var language = document.getElementById("languageSelect");
    const data = {
        language: language.value,
        text: textarea.value
    };
    $.post("/editor/highlight", data, function (data, response) {
        if (response === "success") {
            previousText = displayArea.innerHTML;
            displayArea.innerHTML = data.replace(/\n$/g, '\n\n');
        }
    });
}
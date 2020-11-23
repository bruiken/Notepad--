var isRequesting = false;
var requestHighlight = false;

$(() => {
    var backArea = document.querySelector('.backArea');
    var textArea = document.getElementById('textArea');
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
    var textArea = document.getElementById('textArea');
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

function selectedText(){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function search(site) {
    switch (site){
        case 'google': 
            window.open("http://www.google.com/search?q=" + selectedText());
            break;
        case 'youtube':
            window.open("https://www.youtube.com/results?search_query=" + selectedText());
            break;
        case 'stackoverflow':
            window.open("https://stackoverflow.com/search?q=" + selectedText());
            break; 
        case 'reddit':
            window.open
            ("https://www.reddit.com/r/ProgrammerHumor/search?q=" + selectedText() + 
            "&restrict_sr=on&sort=relevance&t=all")
        default: 
            console.alert("No site found")
        
    }
}
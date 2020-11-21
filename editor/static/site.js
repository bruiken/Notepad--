var isSaved = true;
var savedText = "";
var previousText = "";




$(() => {
    var backdrop = document.querySelector('.backdrop');
    var textArea = document.getElementById('textArea');
    var displayArea = document.querySelector('.displayArea');
    displayArea.innerHTML = restoreText(textArea)

    textArea.addEventListener("scroll", function()
    {
        backdrop.scrollTop = textArea.scrollTop;
        backdrop.scrollLeft = textArea.scrollLeft;
    });

    textArea.addEventListener("input", function()
    {
        processPost(this);
    });
});


function saveText(textarea) {
    savedNotification();
    var htmlContents = textarea.innerHTML;
    localStorage.setItem(textarea.id, htmlContents);
    savedText = htmlContents;
    isSaved = true;
    setTitle(isSaved);
}

function setTitle(isSaved) {
    var title = "";
    if(!isSaved) {
        title += '*';
    }
    title += "Editing Document";
    document.title = title;
}


function savedNotification() {
    $('#saved').fadeIn(300).delay(1500).fadeOut(400);
}

function restoreText(textarea) {
    var savedValue = localStorage.getItem(textarea.id);
    if(!savedValue) {
        return ""
    }
    savedText = savedValue;
    return savedValue;
}

function downloadfile(name){
    var textArea = document.getElementById("textArea");
    var workElement = document.createElement("a");
    if ('download' in workElement) {
        var text = restoreText(textArea);
        var file = new Blob([text], {type: 'text/plain'});
        workElement.href = URL.createObjectURL(file);
        workElement.download = name;
        document.body.appendChild(workElement);
        workElement.click();
        document.body.removeChild(workElement);
    }
}

function selectedLanguage() {
    var textArea = document.getElementById('textArea');
    processPost(textArea);
}

function processPost (textarea) {
    isSaved = textarea.value == savedText;
    var displayArea = document.querySelector(".displayArea");
    var language = document.getElementById("languageSelect");
    // Changed
    const data = {
        language: language.value,
        text: textarea.value
    };
    $.post("/editor", data, function (data, response) {
        if (response === "success") {
            previousText = displayArea.innerHTML;
            displayArea.innerHTML = data.replace(/\n$/g, '\n\n');
        }
    }); 
}

function processPre (event, textarea) {
    if (event.ctrlKey && event.keyCode === 83) {
        event.preventDefault();
        if(!isSaved) saveText(textarea);
        return false;
    }

    if(event.keyCode === 9) {
        event.preventDefault();
        var v = textarea.value, s = textarea.selectionStart, e = textarea.selectionEnd;
        nr_spaces = 4; 
        textarea.value = v.substring(0, s) + ' '.repeat(nr_spaces) + v.substring(e);
        textarea.selectionStart = textarea.selectionEnd = s + nr_spaces;
        return false;
    }
}

function fileLoad(inputField){ // loads a file 
    var file = document.getElementById("fileinput").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var textArea = document.getElementById("codeField");
        textArea.value = e.target.result;
        isSaved = textArea.value == savedText;
        setTitle(isSaved);    
    };
    reader.readAsText(file);
}
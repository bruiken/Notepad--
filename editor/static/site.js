var isSaved = true;
var savedText = "";

$(() => {
    var codeField = document.getElementById('codeField');
    codeField.value = restoreText(codeField);
});


function saveText(textarea) {
    savedNotification();
    localStorage.setItem(textarea.id, textarea.value);
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
    var textField = document.getElementById("codeField");
    var workElement = document.createElement("a");
    if ('download' in workElement) {
        var text = restoreText(textField);
        var file = new Blob([restoreText(textField)], {type: 'text/plain'});
        workElement.href = URL.createObjectURL(file);
        workElement.download = name;
        document.body.appendChild(workElement);
        workElement.click();
        document.body.removeChild(workElement);
    }
}

function processText (event, textarea) { 
    if (event.ctrlKey && event.keyCode === 83) {
        event.preventDefault();
        if(!isSaved) saveText(textarea);
        return false;
    }

    isSaved = textarea.value == savedText;

    setTitle(isSaved);

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
    };
    reader.readAsText(file);    
}

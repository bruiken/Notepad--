var isSaved = true;
var savedText = "";
var textArea = document.getElementById("textArea");

$(() => {
    setEditorText(restoreText(textArea));
});

function saveText(textarea) {
    infoNotification('Saved');
    localStorage.setItem(textarea.id, textarea.value);
    savedText = textarea.value;
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

function infoNotification(text) {
    $('#saved').text(text);
    $('#saved').fadeIn(300).delay(1500).fadeOut(400);
}

function warnNotification(text) {
    $('#warning').text(text);
    $('#warning').fadeIn(300).delay(1500).fadeOut(400);
}


function restoreText(textarea) {
    var saved = localStorage.getItem(textarea.id) || "";
    savedText = saved;
    return saved;
}

function setEditorText(text) {
    textArea.value = text;
    $(document).trigger('textChanged');
}

function getEditorText(text) {
    return textArea.value;
}

function setEditorScrollPos(scrollPos) {
    textArea.scrollLeft = scrollPos[0];
    textArea.scrollTop = scrollPos[1];
}

function getEditorScrollPos() {
    return [textArea.scrollLeft, textArea.scrollTop];
}

function downloadfile(name){
    var workElement = document.createElement("a");
    if ('download' in workElement) {
        var text = restoreText(textArea);
        var file = new Blob([restoreText(textArea)], {type: 'text/plain'});
        workElement.href = URL.createObjectURL(file);
        workElement.download = name;
        document.body.appendChild(workElement);
        workElement.click();
        document.body.removeChild(workElement);
    }
}

function processTitle(event, textarea) {
    isSaved = textarea.value == savedText;
    setTitle(isSaved);
}

function processText (event, textarea) { 
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
        $(document).trigger('fileLoad_before', [file.name]);
        setEditorText(e.target.result);
        isSaved = textArea.value == savedText;
        setTitle(isSaved);
    };
    $('input[type="file"]').val(null);
    reader.readAsText(file);
}

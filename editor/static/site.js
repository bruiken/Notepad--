var isSaved = true;
var savedText = "";
var currentItem = 'textArea';

$(() => {
    var textArea = document.getElementById(currentItem);
    console.log(textArea.id);
    textArea.value = restoreText(textArea);
});

function passID(id){
    currentItem = id;
}

function saveText(textarea) {
    console.log("current textarea " + textarea.id);
    savedNotification();
    localStorage.setItem(textarea.id, textarea.value);
    console.log("saving: " + textarea.id + " with value " +  localStorage.getItem(textarea.id));
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


function savedNotification() {
    $('#saved').fadeIn(300).delay(1500).fadeOut(400);
}

function restoreText(textarea) {
    restoreTabs();
    var savedValue = localStorage.getItem(textarea.id);
    if(!savedValue) {
        return ""
    }
    savedText = savedValue;
    return savedValue;
}

function restoreTabs(){
    var textArea2 = document.getElementById('textArea2');
    textArea2.value = localStorage.getItem(textArea2.id);
    var textArea3 = document.getElementById('textArea3');
    textArea3.value = localStorage.getItem(textArea3.id);
}

function downloadfile(name){
    var textArea = document.getElementById(currentItem);
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
        //if(!isSaved) 
        saveText(textarea);
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
        var textArea = document.getElementById(currentItem);
        textArea.value = e.target.result;
        isSaved = textArea.value == savedText;
        setTitle(isSaved);
        $(document).trigger('fileLoad_done');
    };
    reader.readAsText(file);
}















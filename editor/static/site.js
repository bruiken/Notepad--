// Boolean that is set to true of the text is saved
var isSaved = true;
// The saved text obtained from the localstorage
var savedText = "";
// The textarea obtained by id
var textArea = document.getElementById("textArea");

// Loaded on page load
$(() => {
    // Restore and set the editor text
    setEditorText(restoreText(textArea));
});

/**
 * Saves the text and shows a notification
 * @param {textarea} textarea The textarea field
 */
function saveText(textarea) {
    infoNotification('Saved');
    localStorage.setItem(textarea.id, textarea.value);
    savedText = textarea.value;
    isSaved = true;
    setTitle(isSaved);
}

/**
 * Set the title of the page, add a * if not saved
 * @param {boolean} isSaved The boolean that indicates of the text is saved
 */
function setTitle(isSaved) {
    var title = "";
    if(!isSaved) {
        title += '*';
    }
    title += "Editing Document";
    document.title = title;
}

/**
 * Send out an info notification
 * @param {string} text The text for the notification
 */
function infoNotification(text) {
    $('#saved').text(text);
    $('#saved').fadeIn(300).delay(1500).fadeOut(400);
}

/**
 * Send out a warning notification
 * @param {string} text The text for the notification
 */
function warnNotification(text) {
    $('#warning').text(text);
    $('#warning').fadeIn(300).delay(1500).fadeOut(400);
}

/**
 * Get the text from the localstorage
 * @param {textarea} textarea 
 */
function restoreText(textarea) {
    var saved = localStorage.getItem(textarea.id) || "";
    savedText = saved;
    return saved;
}

/**
 * Set the editor text
 * @param {string} text The text to set
 */
function setEditorText(text) {
    textArea.value = text;
    $(document).trigger('textChanged');
}

/**
 * Get the editor text
 */
function getEditorText() {
    return textArea.value;
}

/**
 * Set the scroll position for the editor
 * @param {list} scrollPos List of scroll positions
 */
function setEditorScrollPos(scrollPos) {
    textArea.scrollLeft = scrollPos[0];
    textArea.scrollTop = scrollPos[1];
}

/**
 * Get the scroll position of the editor
 */
function getEditorScrollPos() {
    return [textArea.scrollLeft, textArea.scrollTop];
}

/**
 * Download a file with name
 * @param {string} name The name of the downloaded element
 */
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

/**
 * Set the title on key release
 * @param {*} event The keyrelease event
 * @param {*} textarea The textarea
 */
function processTitle(event, textarea) {
    isSaved = textarea.value == savedText;
    setTitle(isSaved);
}

/**
 * Process the text on keypress, adds the ctrl+s save keybind and fixes tabbing
 * @param {*} event The keypress event
 * @param {*} textarea The textarea
 */
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

/**
 * Load a file 
 */
function fileLoad(){
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

$(() => {
});

/**
 * Sends a request to the server that attempts to 
 * @param {string} language 
 */
function compileandrun(language){
    var editor_text = getEditorText(); 
    console.log('Attempting to run code with language "' + language + '"');
    const data = {
        code: editor_text,
        language: language
    };
    $.post("/editor/code_runner", data, function (data) {
        if (data['success'] === true) {
            console.log('Attempt successful. Output: ' + data['message']);
        }
        else if (data['success'] === false) {
            console.log('Attempt failed. Cause: ' + data['message']);
        }
    })
}
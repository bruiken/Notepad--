/**
 * Sends a request to the server that attempts to run the code in the current tab for the given language.
 * The console shows whether the attempt was successful or not.
 * @param {string} language The language of the code, user given.
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
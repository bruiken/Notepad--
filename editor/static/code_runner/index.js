function compileandrun(filepath, language){
    console.log('Attempting to compile file "' + filepath + '" with language "' + language + '"');
    const data = {
        filepath: filepath,
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
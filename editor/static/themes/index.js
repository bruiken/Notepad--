$(() => {
    replaceBootstrapStyle();
});

function savedTheme() {
    var mainTheme = document.getElementById('mainThemeSelect').value;
    localStorage.setItem("mainTheme", mainTheme);
    replaceBootstrapStyle();
    var editorThemeSelect = document.getElementById('editorThemeSelect');
    if(editorThemeSelect) {
        localStorage.setItem("editorTheme", editorThemeSelect.value);
        initialize_stylesheet();
    }
}

function replaceBootstrapStyle() {
    var savedBootstrapCssTheme = localStorage.getItem("mainTheme");
    if(!savedBootstrapCssTheme) {
        return;
    }
    var data = {
        'theme': savedBootstrapCssTheme
    };
    $.post("/editor/themes/bootstrap", data, function (data, response) {
        if (response === "success") {
            document.getElementsByTagName('link')[0].outerHTML = data;
        }
    });
}
$(() => {
    replaceBootstrapStyle();
    setSelectedThemes();
});

const storeMainTheme = "mainTheme";
const storeMainThemeIndex = "mainThemeIndex";
const storeEditorTheme = "editorTheme";
const storeEditorThemeIndex = "editorThemeIndex";

function savedTheme() {
    const mainThemeSelect = document.getElementById('mainThemeSelect');
    localStorage.setItem(storeMainTheme, mainThemeSelect.value);
    localStorage.setItem(storeMainThemeIndex, mainThemeSelect.selectedIndex);
    replaceBootstrapStyle();
    const editorThemeSelect = document.getElementById('editorThemeSelect');
    if(editorThemeSelect) {
        localStorage.setItem(storeEditorTheme, editorThemeSelect.value);
        localStorage.setItem(storeEditorThemeIndex, editorThemeSelect.selectedIndex);
        initialize_stylesheet(); // call to static/highlight/index.js
    }
}

function setSelectedThemes() {
    var mainThemeIndex = localStorage.getItem(storeMainThemeIndex);
    if (mainThemeIndex !== null) {
        const mainThemeSelect = document.getElementById('mainThemeSelect');
        mainThemeSelect.selectedIndex = mainThemeIndex;
    }
    const editorThemeSelect = document.getElementById('editorThemeSelect');
    if(editorThemeSelect) {
        var editorThemeIndex = localStorage.getItem(storeEditorThemeIndex);
        if (editorThemeIndex !== null) {
            editorThemeSelect.selectedIndex = editorThemeIndex;
        }
    }
}

function replaceBootstrapStyle() {
    var savedBootstrapCssTheme = localStorage.getItem(storeMainTheme);
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
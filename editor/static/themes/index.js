// This code is called when the page is done loading, this sets the themes that were set previously (or the default theme)
$(() => {
    replaceBootstrapStyle();
    setSelectedThemes();
});

// The keys for the localstorage
const storeMainTheme = "mainTheme";
const storeMainThemeIndex = "mainThemeIndex";
const storeEditorTheme = "editorTheme";
const storeEditorThemeIndex = "editorThemeIndex";

/**
 * Replace the themes by getting the selected theme, replacing the bootstrap and replacing the highlight theme 
 * if that feature is enabled
 */
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

/**
 * Set the themes that are selected, this makes sure so when you click on the theme settings you see 
 * the same theme that was selected before
 */
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

/**
 * Replace the bootstrap style
 */
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
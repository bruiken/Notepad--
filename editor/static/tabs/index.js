var totalTabs = 0;
var focusedTab = 0;
var totalTabs = 1;
var previousFocusedTab = 0;
var textFields = {};

$(() => {
    $(document).bind('fileLoad_before', () => {
        addTab();
    });

    $(document).bind('textChanged', () => {
        textFields[focusedTab] = getEditorText();
    });
});

function addTab(event) {
    if(event) {
        event.preventDefault();
    }
    totalTabs += 1;
    var newId = getLastTabNumber()+1;
    var newTabHTML = `
        <li class="nav-item" id="Tab-${newId}">
            <a href="#${newId}" class="nav-link" onclick="focusTab(event, ${newId});"><button class="close" onclick="closeTab(event, ${newId});" type="button"> <sup>&times;</sup></button>New Tab</a>
        </li>
    `;
    $(newTabHTML).insertBefore('#newTab');
    textFields[newId] = "";
    focusTab(null, newId);
}

function closeTab(event, number) {
    event.stopPropagation();
    totalTabs -= 1;

    document.getElementById("Tab-" + number).remove();

    if(!(previousFocusedTab in textFields)) {
        console.log("HIERO")
        previousFocusedTab = getLastTabNumber();
    }
    if(focusedTab === number && previousFocusedTab != focusedTab) {
        focusTab(event, previousFocusedTab);
    }
    delete textFields[number];
}

function focusTab(event, number) {
    if(event) {
        event.preventDefault();
    }
    $(`#Tab-${number} a`).tab('show');
    previousFocusedTab = focusedTab;
    textFields[previousFocusedTab] = getEditorText();
    focusedTab = number;
    setEditorText(textFields[focusedTab]);
}

function getLastTabNumber() {
    var tabElems = $('#tabBar li');
    var lastTab = tabElems[tabElems.length - 2].id;
    return parseInt(lastTab.slice(-1));
}

function saveTabs() {
    return;
}

function setTitle(isSaved) {
    return;
}
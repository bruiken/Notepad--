var totalTabs = 0;
var focusedTab = 0;
var totalTabs = 1;
var previousFocusedTab = 0;
var tabInfo = {};

$(() => {
    $(document).bind('fileLoad_before', (e, fileName) => {
        addTab(e, fileName);
    });

    // setTitle = setTabTitle;
    saveText = saveCurrentTab;
    restoreText = restoreTabText;

    $(document).bind('fileLoad_before', () => {
        addTab(true);
    });

    $(document).bind('textChanged', () => {
        tabInfo[focusedTab] = {
            text: getEditorText(),
            scrollPos: getEditorScrollPos()
        };
    });

    restoreTabs();
});

function addTab(focus, name="New Tab", id=-1, event=null) {
    if(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if(id === -1) {
        totalTabs += 1;
        id = getLastTabNumber()+1;
    }
    var newTabHTML = `
        <li class="nav-item" id="Tab-${id}">
            <a class="nav-link" onclick="focusTabEvent(event, ${id});"><button class="close" onclick="closeTabEvent(event, ${id});" type="button">&times;</button>${name}</a>
    `;
    $(newTabHTML).insertBefore('#newTab');
    tabInfo[id] = {
        name: name,
        text: "",
        scrollPos: [0, 0]
    };
    if(focus) {
        focusTab(id);
    }
}

function closeTab(number, event=null) {
    if(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    totalTabs -= 1;

    document.getElementById("Tab-" + number).remove();

    if(!(previousFocusedTab in tabInfo)) {
        previousFocusedTab = getLastTabNumber();
    }
    if(focusedTab === number && previousFocusedTab != focusedTab) {
        focusTab(previousFocusedTab);
    }
    delete tabInfo[number];
}

function focusTab(number, savePreviousText=true, event=null) {
    if(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if(focusedTab != number)
    {
        $(`#Tab-${number} a`).tab('show');
        if(savePreviousText) {
            previousFocusedTab = focusedTab;
            currentTabInfo = getCurrentTabInfo();
            tabInfo[previousFocusedTab] = currentTabInfo;
        }
        focusedTab = number;
    }
    setCurrentTabInfo(tabInfo[focusedTab])
}

function focusTabEvent(event, number) {
    focusTab(number);
}

function getCurrentTabInfo() {
    return {
        text: getEditorText(),
        scrollPos: getEditorScrollPos()
    }
}

function setCurrentTabInfo(current) {
    setEditorText(current.text);
    setEditorScrollPos(current.scrollPos);
}

function getLastTabNumber() {
    var tabElems = $('#tabBar li');
    var lastTab = tabElems[tabElems.length - 2].id;
    return parseInt(lastTab.slice(-1));
}

function restoreTabs()
{
    var savedTabs = getSavedTabs();
    var toCreate = savedTabs[0];
    var toFocus = savedTabs[1];
    for(key in toCreate) {
        var current = toCreate[key];
        if(key !== "0") {
            addTab(false, key, current.name);
        }
        tabInfo[key] = toCreate[key];
    }

    focusTab(toFocus, false);
}

function saveAllTabs() {
    setSavedTabs(tabInfo);
}

function saveCurrentTab()
{
    var savedTabs = getSavedTabs()[0];
    setSavedTabs(savedTabs);
}

function restoreTabText() {
    var savedTabs = getSavedTabs()[0];
    return savedTabs[focusedTab].text;
}

function setSavedTabs(savedTabs) {
    savedTabs[focusedTab] = getCurrentTabInfo();
    localStorage.setItem("focusedTab", focusedTab);
    localStorage.setItem("tabs", JSON.stringify(savedTabs));
}

function getSavedTabs() {
    var savedTabs = JSON.parse(localStorage.getItem("tabs") || {});
    var focusedTab = parseInt(localStorage.getItem("focusedTab") || "0");
    return [savedTabs, focusedTab];
}
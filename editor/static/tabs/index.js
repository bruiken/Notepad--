var totalTabs = 0;
var focusedTab = 0;
var totalTabs = 1;
var previousFocusedTab = 0;
var tabInfo = {};
var savedTabInfo = {};

$(() => {
    $(document).bind('fileLoad_before', (e, fileName) => {
        addTab(e, fileName);
    });

    setTitle = setTabTitle;
    saveText = saveCurrentTab;
    restoreText = restoreTabText;

    $(document).bind('textChanged', () => {
        var current = tabInfo[focusedTab];
        tabInfo[focusedTab] = {
            text: getEditorText(),
            scrollPos: getEditorScrollPos(),
            name: current.name
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
            <a class="nav-link" onclick="focusTab(${id}, true);"><button class="close" onclick="closeTab(${id}, event);" type="button">&times;</button><span id=titleTab>${name}</h1></a>
    `;
    $(newTabHTML).insertBefore('#newTab');
    newInfo = {
        text: "",
        scrollPos: [0, 0],
        name: name
    };
    tabInfo[id] = newInfo;
    savedTabInfo[id] = newInfo;
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
    $(`#Tab-${number} a`).tab('show');
    if(savePreviousText) {
        previousFocusedTab = focusedTab;
        currentTabInfo = getCurrentTabInfo();
        tabInfo[previousFocusedTab] = currentTabInfo;
    }
    focusedTab = number;
    setCurrentTabInfo(tabInfo[focusedTab])
}

function getCurrentTabInfo() {
    return {
        text: getEditorText(),
        scrollPos: getEditorScrollPos(),
        name: tabInfo[focusedTab].name
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
    getSavedTabs();
    for(key in savedTabInfo) {
        var current = savedTabInfo[key];
        if(key !== "0") {
            addTab(false, current.name, key);
        }
        tabInfo[key] = current;
    }

    focusTab(focusedTab, false);
}

function saveAllTabs() {
    infoNotification('Saved All Tabs');
    savedTabInfo = tabInfo;
    setSavedTabs();
    restoreAllTabTitle();
}

function saveCurrentTab()
{
    infoNotification('Saved Tab');
    setSavedTabs();
    setTabTitle();
}

function restoreTabText() {
    getSavedTabs();
    return savedTabInfo[focusedTab].text;
}

function setSavedTabs() {
    savedTabInfo[focusedTab] = getCurrentTabInfo();
    localStorage.setItem("focusedTab", focusedTab);
    localStorage.setItem("tabs", JSON.stringify(savedTabInfo));
}

function getSavedTabs() {
    var emptySave = [{
        text: "",
        scrollPos: [0, 0],
        name: "New Tab"
    }];
    var savedTabs = ""
    try {
        savedTabs = JSON.parse(localStorage.getItem("tabs"));
    } catch(e) {
        savedTabs = emptySave;
    }
    if(savedTabs === null) {
        savedTabs = emptySave;
    }
    focusedTab = parseInt(localStorage.getItem("focusedTab") || "0");
    savedTabInfo = savedTabs;
}

function setTabTitle() {
    if(savedTabInfo !== null) {
        var current = getCurrentTabInfo();
        var title = current.name;
        if (Object.keys(savedTabInfo).length <= focusedTab || current.text !== savedTabInfo[focusedTab].text) {
            title = "*" + title;
        }

        var element = $(`#Tab-${focusedTab} #titleTab`)[0];
        element.textContent = title;
    }
}

function restoreAllTabTitle() {
    for(key in tabInfo) {
        var element = $(`#Tab-${key} #titleTab`)[0];
        element.textContent = tabInfo[key].name;
    }
}
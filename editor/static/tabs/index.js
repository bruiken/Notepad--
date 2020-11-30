// The current focused tab, initially the first tab (0) is focused
var focusedTab = 0;
// Counter that keeps track of the total tabs
var totalTabs = 1;
// The variable that keeps track of the previous tab that was focused
var previousFocusedTab = 0;
// The dictionary that stores all the info of every tab, the key is the id and the object is the text, the scroll position and the name
var tabInfo = {};
// The dictionary that was saved in the localstorage
var savedTabInfo = {};

// Executed when the page is done loading, this sets up all the callbacks when certain triggers happen (such as file loading)
// and overloads functions from core functionality
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

/**
 * Adds a new tab by adding the relevant HTML and storing the tab's info in a dictionary 
 * @param {boolean} focus Indicates if a new tab receives focus or not
 * @param {string} name The name for the new tab
 * @param {integer} id The id for the new tab
 * @param {event} event The event that triggered this function
 */
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

/**
 * Close the tab  by removing the html and swapping the text to the new focused tab
 * @param {integer} number 
 * @param {event} event 
 */
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

/**
 * Focus a tab, saves text of the current tab (to be unfocused) optionally
 * @param {integer} number 
 * @param {boolean} savePreviousText 
 * @param {event} event 
 */
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

/**
 * Get the info of the current tab (text, scroll position and name)
 */
function getCurrentTabInfo() {
    return {
        text: getEditorText(),
        scrollPos: getEditorScrollPos(),
        name: tabInfo[focusedTab].name
    }
}

/**
 * Set the information of the current tab, it sets the text and scroll position 
 * @param {dictionary} current 
 */
function setCurrentTabInfo(current) {
    setEditorText(current.text);
    setEditorScrollPos(current.scrollPos);
}

/**
 * Get the id of the last tab, by looping through the html elements
 */
function getLastTabNumber() {
    var tabElems = $('#tabBar li');
    var lastTab = tabElems[tabElems.length - 2].id;
    return parseInt(lastTab.slice(-1));
}

/**
 * Restore all tabs by getting the tabs from the localstorage and calling the addTab and focusTab functions
 */
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

/**
 * Save all the tabs by setting them in localstorage and show a notification
 */
function saveAllTabs() {
    infoNotification('Saved All Tabs');
    savedTabInfo = tabInfo;
    setSavedTabs();
    restoreAllTabTitle();
}

/**
 * Save the current tab by setting it in localstorage and show a notification 
 */
function saveCurrentTab()
{
    infoNotification('Saved Tab');
    setSavedTabs();
    setTabTitle();
}

/**
 * Restore the text of the focused tab by first getting it from localstorage
 */
function restoreTabText() {
    getSavedTabs();
    return savedTabInfo[focusedTab].text;
}

/**
 * Store the focused tab and the info of all the tabs in the localstorage
 */
function setSavedTabs() {
    savedTabInfo[focusedTab] = getCurrentTabInfo();
    localStorage.setItem("focusedTab", focusedTab);
    localStorage.setItem("tabs", JSON.stringify(savedTabInfo));
}

/**
 * Get the info from the tabs and the focused tab from localstorage
 */
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

/**
 * Set the title for the current tab by looking if it was modified or not, adds a * if it was
 */
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

/**
 * Restore the title for all the tabs by setting it to the name that was previously stored
 */
function restoreAllTabTitle() {
    for(key in tabInfo) {
        var element = $(`#Tab-${key} #titleTab`)[0];
        element.textContent = tabInfo[key].name;
    }
}
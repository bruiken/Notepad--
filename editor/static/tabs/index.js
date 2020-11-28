var totalTabs = 0;
var focusedTab = 0;
var totalTabs = 1;
var previousFocusedTab = 0;
var tabInfo = {};

$(() => {
    $(document).bind('fileLoad_before', (e, fileName) => {
        addTab(e, fileName);
        console.log(fileName);
    });

    $(document).bind('textChanged', () => {
        tabInfo[focusedTab] = {
            text: getEditorText(),
            scrollPos: getEditorScrollPos()
        };
    });
});

function addTab(event, fileName) {
    if(event) {
        event.preventDefault();
    }
    totalTabs += 1;
    var newId = getLastTabNumber()+1;
    var newTabHTML = `
        <li class="nav-item" id="Tab-${newId}">
            <a href="#${newId}" class="nav-link" onclick="focusTab(event, ${newId});"><button class="close" onclick="closeTab(event, ${newId});" type="button"> <sup>&times;</sup></button>${fileName}</a>
        </li>
    `;
    $(newTabHTML).insertBefore('#newTab');
    tabInfo[newId] = {
        text: "",
        scrollPos: [0, 0]
    };
    focusTab(null, newId);
}

function closeTab(event, number) {
    event.stopPropagation();
    totalTabs -= 1;

    document.getElementById("Tab-" + number).remove();

    if(!(previousFocusedTab in tabInfo)) {
        previousFocusedTab = getLastTabNumber();
    }
    if(focusedTab === number && previousFocusedTab != focusedTab) {
        focusTab(event, previousFocusedTab);
    }
    delete tabInfo[number];
}

function focusTab(event, number) {
    if(event) {
        event.preventDefault();
    }
    $(`#Tab-${number} a`).tab('show');
    previousFocusedTab = focusedTab;
    currentTabInfo = getCurrentTabInfo();
    tabInfo[previousFocusedTab] = currentTabInfo;
    focusedTab = number;
    setCurrentTabInfo(tabInfo[focusedTab])
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

function saveTabs() {
    return;
}

function setTitle(isSaved) {
    return;
}
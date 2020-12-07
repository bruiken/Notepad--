$(() => {
    var inputBox = document.getElementById("placeholderDiff");
    if(typeof focusedTab === 'undefined') {
	inputBox.disabled = true;
	inputBox.value = "Click diff to see unsaved changes";
    }
});

function diffPost(){
    var inputBox = document.getElementById("placeholderDiff");
    var diffs = ["", ""];
    if(typeof focusedTab !== 'undefined') {
	var input = inputBox.value;
	var keyArray = setupKeyArray();
	diffs = getDiffTextTabs(input, keyArray);
    } else {
	diffs = getDiffText();
    }
    if(diffs === null) {
	alert("Invalid input");
	return;
    }
    fetch('/diff', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "one": diffs[1],
            "two": diffs[0]
        })
    }).then(function (response) { 
        return response.text();
    }).then(function (text) {
        showDiff(text);
    });
}

function getDiffTextTabs(input, keyArray) {
    // Default
    var firstTab = 0;
    var secondTab = 1;

    // Compare with itself if there is only one tab
    if(totalTabs <= 1) {
	secondTab = 0;
    }

    // If the user has made a choice
    if(input !== "") {
	// The input is valid
	if(input > 0 && input <= keyArray.length) {
	    firstTab = focusedTab;
	    secondTab = keyArray[input-1];
	} else {
	    return null;
	}
    }

    if(firstTab === secondTab) {
	return [getTextById(firstTab), savedTabInfo[secondTab].text];
    }

    return [getTextById(firstTab), getTextById(secondTab)];
}

function getDiffText() {
    return [getEditorText(), savedText];
}

function getTextById(id) {
    if (id === focusedTab) return getEditorText();
    return tabInfo[id].text;
}

function setupKeyArray(){
    const object = tabInfo;
    var keyArray = [];
    for (const [key, value] of Object.entries(object))
        keyArray.push(key);
    return keyArray;
}

function showDiff(diff){
    var diffWindow = window.open("");
    diffWindow.document.body.innerHTML = diff;
}


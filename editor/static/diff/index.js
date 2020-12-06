function diffPost(){  
    var keyArray = setupKeyArray();
    var input = document.getElementById("placeholderDiff").value;
    var base = processBaseInput(input);
    var toCompare = processCompareInput(input, keyArray);
    fetch('/diff', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "one": base,
            "two": toCompare
        })
    }).then(function (response) { 
        return response.text();
    }).then(function (text) {
        if (base !== false && toCompare !== false)
            showDiff(text);
        else 
            alert("Invalid input");
    });
}

function setupKeyArray(){
    const object = tabInfo;
    var keyArray = [];
    for (const [key, value] of Object.entries(object))
        keyArray.push(key);
    return keyArray;
}

function processCompareInput(input, keyArray){
    var toCompare = "";
    if (input == "")
        if (focusedTab != 0 && focusedTab == keyArray[1])
            toCompare = getEditorText(); 
        else 
            toCompare = tabInfo[keyArray[1]].text;
    else if (input > 0 && input <= totalTabs)
        toCompare = tabInfo[keyArray[input-1]].text;
    else {
        return false;
    }

    return toCompare
}

function processBaseInput(input){
    var base = "";
    if (input == ""){ 
        if (focusedTab == 0)
            base = getEditorText();
        else
            base = tabInfo[0].text; 
    }
    else if (input > 0 && input <= totalTabs)
        base = getEditorText();
    else 
        return false;
    return base;
}

function showDiff(diff){
    var diffWindow = window.open("");
    diffWindow.document.body.innerHTML = diff;
}


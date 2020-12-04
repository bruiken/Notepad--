function diffPost(){  
    const object = tabInfo;
    var keyArray = [];
    for (const [key, value] of Object.entries(object))
        keyArray.push(key);
    var input = document.getElementById("placeholderDiff").value;
    var valid = true;
    var base = ""
    var toCompare = ""
    if (input == ""){ // default case
        if (focusedTab == 0){
            base = getEditorText();
            toCompare = savedTabInfo[keyArray[1]].text;
        }
        else{
            base = tabInfo[0].text;
            toCompare = savedTabInfo[keyArray[1]].text;
        }
    }
    else if (input > 0 && input <= totalTabs){
        base = getEditorText();
        toCompare = tabInfo[keyArray[input-1]].text;
    }
    else {
        alert("Invalid input");
        valid = false;
    }

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
        if (valid)
            showDiff(text)
    });

}



function showDiff(diff){
    var diffWindow = window.open("");
    diffWindow.document.body.innerHTML = diff;
}


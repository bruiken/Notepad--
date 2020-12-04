function diffPost(){
    var input = document.getElementById("placeholderDiff").value;
    console.log("input " , input);
    var valid = true;
    var base = ""
    var toCompare = ""
    if (input == ""){
        base = savedTabInfo[0].text;
        toCompare = savedTabInfo[1].text;
    }
    else if (input > 0 && input <= totalTabs && input - 1 != focusedTab){
        base = getEditorText();
        toCompare = tabInfo[input - 1].text;
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


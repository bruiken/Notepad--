function diffPost(){
    var abc = tabInfo[0].text;
    var abc2 = savedTabInfo[1].text;
    fetch('/diff', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "one": abc,
            "two": abc2
        })
    }).then(function (response) { // At this point, Flask has printed our JSON
        return response.text();
    }).then(function (text) {
    
        console.log('POST response: ');
        // Should be 'OK' if everything was successful
        showDiff(text)
    });

}

function showDiff(diff){
    console.log(diff);
    var diffWindow = window.open("");
    diffWindow.document.body.innerHTML = diff;

    
}


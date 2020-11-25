function selectedText(){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function search(site) {
    switch (site){
        case 'google': 
            window.open("http://www.google.com/search?q=" + selectedText());
            break;
        case 'youtube':
            window.open("https://www.youtube.com/results?search_query=" + selectedText());
            break;
        case 'stackoverflow':
            window.open("https://stackoverflow.com/search?q=" + selectedText());
            break; 
        case 'reddit':
            window.open
            ("https://www.reddit.com/r/ProgrammerHumor/search?q=" + selectedText() + 
            "&restrict_sr=on&sort=relevance&t=all")
        default: 
            console.alert("No site found")

    }
}
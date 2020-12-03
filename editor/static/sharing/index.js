function share(program){
    if (program =="whatsapp"){
        var whatsapp = "https://web.whatsapp.com/send?text=```";
        var text = savedTabInfo[focusedTab].text;
        console.log(text);
        window.open(whatsapp + encodeURIComponent(text) + "```" + "%0a%0a This was shared via Notepad--");
    }
    else if (program=="mail")
        window.open('mailto:test@example.com?subject=This was shared via Notepad--&body=' +  encodeURIComponent(savedTabInfo[focusedTab].text));
    else if (program=="reddit")
        window.open('https://www.reddit.com/r/ProgrammerHumor/submit?selftext=true')
}
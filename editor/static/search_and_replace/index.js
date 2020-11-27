function searchLocal(search, replace){
    var searchTerm = search.value; 
    var replaceTerm = replace.value;
    var textArea = document.getElementById('textArea'); // current tab text
    var toReplace = textArea.value;
    var newText = toReplace.replaceAll(searchTerm, replaceTerm)
    localStorage.setItem(textArea.id,newText);
    location.reload();
} 

function searchLocal(search, replace){
    var searchTerm = search.value; 
    var replaceTerm = replace.value;
    var newText = getEditorText().replaceAll(searchTerm, replaceTerm)
    setEditorText(newText);
} 

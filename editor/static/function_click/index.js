// variable to keep track of state of control button
var control_being_pressed = false;
// variables to keep track of the locations of functions and the calls to them
var function_locations = [];
var call_locations = [];

var textArea, displayArea;
var $textArea;

/**
 * 
 */
$(() => {
    textArea = document.getElementById('textArea');
    displayArea = document.getElementById('function-click-area');
    $textArea = $('#textArea');
    
    displayArea.innerHTML = restoreText(textArea);

    textArea.addEventListener("scroll", function () {
        equalize_scrolls(displayArea, textArea);
    });

    textArea.addEventListener("input", function () {
        equalize_scrolls(displayArea, textArea);
        copy_text(displayArea, textArea);
    });

    textArea.addEventListener("blur", function () {
        equalize_scrolls(displayArea, textArea);
    });

    $(document).bind('fileLoad_done', () => {
        equalize_scrolls(displayArea, textArea);
        copy_text(displayArea, textArea);
    });

    $('#textArea').keydown(function (event) {
        if (event.key === 'Control') control_pressed();
    });

    $('#textArea').keyup(function (event) {
        if (event.key === 'Control') control_released();
    });

    $('#textArea').mouseup(function (event) {
        if (control_being_pressed) click_with_control();
    });

    equalize_scrolls(displayArea, textArea);
    copy_text(displayArea, textArea);
});

/**
 * 
 */
function control_pressed() {
    if (control_being_pressed) return;
    control_being_pressed = true;
    let re = /([a-zA-Z0-9-_]+) *\([^\)]*\)(?![ \n\r\t]*{| *:)/gm;
    let re2 = /([a-zA-Z0-9-_]+) *\([^\)]*\)(?=[ \n\r\t]*{| *:)/gm;
    var codeValue = textArea.value;
    var func_def_hits = [...codeValue.matchAll(re2)];
    var func_call_hits = [...codeValue.matchAll(re)];
    func_call_hits.reverse();
    for (const func of func_call_hits) {
        codeValue = surround_with_span(codeValue, func.index, func[1].length);
        call_locations.push({name: func[1], length: func[1].length, index: func.index});
    }
    displayArea.innerHTML = codeValue;
    for (const func of func_def_hits) {
        function_locations.push({name: func[1], length: func[1].length, index: func.index});
    }
}

/**
 * 
 * @param {string} fullCode sdasdf
 * @param {number} index 
 * @param {number} length 
 */
function surround_with_span(fullCode, index, length) {
    const pre_span = '<span class="ctrl-hovering">';
    const post_span = '</span>'
    const upto_span = fullCode.substr(0, index);
    var result = upto_span + pre_span;
    result += fullCode.substr(index, length) + post_span;
    result += fullCode.substr(index + length, fullCode.length - index - length);
    return result;
}

/**
 * 
 * @param {number} cursorPos 
 */
function get_called_function(cursorPos) {
    for (const func of call_locations) {
        if (cursorPos >= func.index && cursorPos <= func.index + func.length) {
            return func;
        }
    }
    return false;
}

/**
 * 
 * @param {string} func_name 
 */
function get_defined_function(func_name) {
    for (const func of function_locations) {
        if (func.name === func_name) {
            return func;
        }
    }
    return false;
}

function scrollTo(position) {
    if (!textArea) { return; }
    if (position < 0) { return; }

    var body = textArea.value;
    if (body) {
        textArea.value = body.substring(0, position);
        textArea.scrollTop = position;
        textArea.value = body;
    }
}

/**
 * 
 */
function click_with_control() {
    var cursorPosition = $textArea.prop("selectionStart");
    var called_func = get_called_function(cursorPosition);
    if (!called_func) return;
    var defined_func = get_defined_function(called_func.name);
    if (!defined_func) {
        warnNotification('No function definition found!')
        return;
    }
    scrollTo(defined_func.index);
    textArea.focus();
    $textArea.prop('selectionStart', defined_func.index);
    $textArea.prop('selectionEnd', defined_func.index + defined_func.length);
}

/**
 * 
 */
function control_released() {
    if (!control_being_pressed) return;
    control_being_pressed = false;
    copy_text(displayArea, textArea);
}

/**
 * 
 */
function equalize_scrolls(displayArea, textArea) {
    displayArea.scrollTop = textArea.scrollTop;
    displayArea.scrollLeft = textArea.scrollLeft;
}

/**
 * 
 */
function copy_text(displayArea, textArea) {
    displayArea.innerHTML = textArea.value;
}
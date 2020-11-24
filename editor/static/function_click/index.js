// variable to keep track of state of control button
var control_being_pressed = false;
// variables to keep track of the locations of functions and the calls to them
var function_locations;
var call_locations;

// variables to reuse jquery and html elements
var textArea, displayArea;
var $textArea;

/**
 * Function gets called when the page is loaded
 */
$(() => {
    // set the jquery and html elements
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
 * Function that gets called when control is pressed on the input field.
 * This searches for all the function definition and calls using some regex. 
 * These values get saved for when the user clicks a function call with control being pressed.
 */
function control_pressed() {
    if (control_being_pressed) return;
    control_being_pressed = true;
    let re = /([a-zA-Z0-9-_]+) *\([^\)]*\)(?![ \n\r\t]*{|[ \n\r\t]*:)/gm;
    let re2 = /([a-zA-Z0-9-_]+) *\([^\)]*\)(?=[ \n\r\t]*{|[ \n\r\t]*:)/gm;
    var codeValue = textArea.value;
    var func_def_hits = [...codeValue.matchAll(re2)];
    var func_call_hits = [...codeValue.matchAll(re)];
    func_call_hits.reverse();
    function_locations = [];
    call_locations = [];
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
 * Surrounds the element at the given index and length with a span. 
 * This span has a style such that it will get underlined. 
 * @param {string} fullCode The full code text
 * @param {number} index The index at which the span should begin
 * @param {number} length The length of the span
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
 * Finds the called function that is at a given position. 
 * This is calculated using a list that is built up in the control_pressed function.
 * @param {number} cursorPos The position of the function call
 * @returns {boolean|object} the custom function object when it is found, false otherwise. 
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
 * Finds the custom function object with the given name.
 * @param {string} func_name The name of the function
 * @returns {boolean|object} the custom function object when it is found, false otherwise. 
 */
function get_defined_function(func_name) {
    for (const func of function_locations) {
        if (func.name === func_name) {
            return func;
        }
    }
    return false;
}

/**
 * Scrolls the textarea to the given position.
 * @param {number} position The position to scroll to.
 */
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
 * Function that gets called when the user clicks in the code with control being pressed.
 * This first looks for the function call at the cursor position.
 * If one is found, then it looks for the corresponding function definition.
 * If one is found, the textarea is scrolled to that point and the definition is selected.
 * If there was no definition found, a notification will be raised to tell the user about this.
 */
function click_with_control() {
    var cursorPosition = $textArea.prop("selectionStart");
    var called_func = get_called_function(cursorPosition);
    if (!called_func) return;
    var defined_func = get_defined_function(called_func.name);
    if (!defined_func) {
        warnNotification('No function definition found!');
        return;
    }
    scrollTo(defined_func.index);
    textArea.focus();
    $textArea.prop('selectionStart', defined_func.index);
    $textArea.prop('selectionEnd', defined_func.index + defined_func.length);
}

/**
 * Function that gets called when the user lets go of the control button.
 * It resets the text in the displayarea to the text in the textarea, this makes sure
 * that all the underlined elements are gone. 
 */
function control_released() {
    if (!control_being_pressed) return;
    control_being_pressed = false;
    copy_text(displayArea, textArea);
}

/**
 * Equalizes the scroll values between the display- and textarea.
 * @param {HTMLDivElement} displayArea The displayarea div
 * @param {HTMLTextAreaElement} textArea The textarea element
 */
function equalize_scrolls(displayArea, textArea) {
    displayArea.scrollTop = textArea.scrollTop;
    displayArea.scrollLeft = textArea.scrollLeft;
}

/**
 * Equalizes the text value between the display- and textarea.
 * @param {HTMLDivElement} displayArea The displayarea div
 * @param {HTMLTextAreaElement} textArea The textarea element
 */
function copy_text(displayArea, textArea) {
    displayArea.innerHTML = textArea.value;
}
var nr_lines;
var $editor_area;
var $line_container;

$(() => {
    $('#textArea').on('input', textAreaChanged);
    $editor_area = $('#textArea');
    $line_container = $('#line-container');
    $editor_area.on('scroll', function () {
        $line_container.scrollTop(textArea.scrollTop);
    });

    $(document).bind('textChanged', () => {
        textAreaChanged();
    });
});

function textAreaChanged() {
    const new_nr_lines = $editor_area.val().split(/\r\n|\r|\n/).length;
    if (new_nr_lines !== nr_lines) {
        nr_lines = new_nr_lines;
        $line_container.html("");
        for (var i=0; i < nr_lines; i++) {
            $line_container.append(`<div class="line-number">${i + 1}</div>`);
        }
    }
}
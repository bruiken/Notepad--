import os
from distutils.util import strtobool
from aop.aop import extends

feature_highlighting = bool(strtobool(os.getenv("USE_HIGHLIGHT")))

if feature_highlighting:
    from pygments import highlight
    from pygments.lexers import get_lexer_by_name, guess_lexer
    from pygments.formatters import HtmlFormatter
    from flask import request

    print("Using feature: Syntax-Highlighting")

    @extends('define_endpoints', after=True)
    def highlighting_endpoints(flaskapp):
        @flaskapp.route('/editor/highlight', methods=['POST'])
        def editor_post():
            return syntax_highlight(request)

        @flaskapp.route('/editor/highlight/style', methods=['POST'])
        def editor_give_stylesheet():
            theme = request.form['theme']
            return HtmlFormatter(style=theme).get_style_defs()

    @extends('feature_states')
    def feature_highlight(features):
        features['highlight'] = True

    @extends('feature_sheets')
    def highlight_css(sheets):
        sheets.append('/static/highlight/index.css')

    @extends('feature_scripts')
    def highlight_js(scripts):
        scripts.append('/static/highlight/index.js')

    @extends('feature_editor_htmls')
    def highlight_editor_html(htmls):
        htmls.append('/highlight/index.html')

    @extends('feature_page_htmls')
    def highlight_page_html(htmls):
        htmls.append('/highlight/language_select.html')

    @extends('feature_navbar_theme_settings_htmls')
    def highlight_navbar_theme_settings_html(htmls):
        htmls.append('/highlight/theme.html')

    def syntax_highlight(request):
        language = request.form['language']
        text = request.form['text']
        if language == "Auto":
            lexer = guess_lexer(text, stripnl=False)
        else:
            lexer = get_lexer_by_name(language, stripnl=False)
        return highlight(text, lexer, HtmlFormatter(nowrap=True))

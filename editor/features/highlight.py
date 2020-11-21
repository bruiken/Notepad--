from pygments import highlight
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.formatters import HtmlFormatter


def SyntaxHighlight(request):
    language = request.form['language']
    text = request.form['text']
    if language == "Auto":
        lexer = guess_lexer(text, stripnl=False)
    else:
        lexer = get_lexer_by_name(language, stripnl=False)
    return highlight(text, lexer, HtmlFormatter(nowrap=True))

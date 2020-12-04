import difflib
from flask import jsonify



def diffOnSentences(one, two):
    text1 = str.splitlines(one)
    text2 = str.splitlines(two)
    return difflib.HtmlDiff().make_file(text1,text2)

def send(package):
    print("inside send check package " ,package)
    return jsonify(package)
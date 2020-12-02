import difflib
from flask import jsonify



def diffTEST(one, two):
    text1 = one.split()
    text2 = two.split()
    return difflib.HtmlDiff().make_file(text1,text2)

def send(package):
    # komt hier gewoon goed
    print("inside send check package " ,package)
    return jsonify(package)
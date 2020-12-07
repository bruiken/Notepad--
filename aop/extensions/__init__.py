from importlib import import_module

possible_features = [
                     'aop.extensions.tabs',
                     'aop.extensions.highlight',
                     'aop.extensions.linenumbers',
                     'aop.extensions.functionclick',
                     'aop.extensions.externalsearch',
                     'aop.extensions.coderunner',
                     'aop.extensions.themes',
                     'aop.extensions.searchandreplace',
                     'aop.extensions.diff']

for feature in possible_features:
    try:
        import_module(feature)
    except ImportError:
        pass

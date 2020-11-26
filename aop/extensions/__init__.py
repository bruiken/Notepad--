import aop.extensions.highlight
import aop.extensions.linenumbers
import aop.extensions.functionclick
import aop.extensions.externalsearch
from importlib import import_module

possible_features = ['aop.extensions.highlight',
                     'aop.extensions.linenumbers',
                     'aop.extensions.functionclick',
                     'aop.extensions.externalsearch']

for feature in possible_features:
    try:
        import_module(feature)
    except ImportError:
        pass

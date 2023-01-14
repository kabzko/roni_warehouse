"""Utils for debugging."""
import sys

from pprint import pprint
from typing import Any

from root import settings
from django.utils.termcolors import colorize

def print_if_local(data):
    """Print data if environment is localhost"""
    try:
        if settings.ENVIRONMENT == "localhost":
            print(data)
    except Exception as exc:
        pass
    
def pprint_bold(text, fg="red"):
    """Print text bold."""
    print(colorize(text, opts=("bold",), fg=fg))

def make_bold(text, fg="red"):
    """Return text as bolded"""
    return colorize(text, opts=("bold",), fg=fg)

def pprint_symbols(symbol="=", symbol_repetition=42, bg="green"):
    """Print colorized symbol repeated."""
    print(colorize(symbol*symbol_repetition, opts=("bold",), fg="white", bg=bg))

def pprint_label(label="DATA", symbol="=", symbol_repetition=20, fg="white", bg="green"):
    "Prints label string, surrounded by repeated symbols, colorized."
    symboled_label = "{} {} {}".format(symbol*symbol_repetition, label, symbol*symbol_repetition)
    print(colorize(symboled_label, opts=("bold",), fg=fg, bg=bg))

def pprint_data(data, label="DATA", fg="white", bg="green"):
    "Pretty print data with label."
    print()
    pprint_label(label, fg=fg, bg=bg)
    pprint(data)
    print()

def pprint_response(response, label="RESPONSE", fg="white", bg="green"):
    """Pretty print response, a shorthand for pprint_data(data=response, label='Response')"""
    pprint_data(data=response, label=label, fg=fg, bg=bg)

def pprint_type(data, label="Type", fg="white", bg="magenta"):
    """Pretty print type of object data."""
    pprint_data(type(data), label=label, fg=fg, bg=bg)

def pprint_dir(data: Any, label="dir(data)", fg="white", bg="blue") -> None:
    """Pretty print dir(data)."""
    try:
        pprint_data(dir(data), label=label, fg=fg, bg=bg)
    except Exception as exc:
        raise exc

def pprint_dict(data: Any, label="data.__dict__", fg="white", bg="green") -> None:
    """Pretty print data.__dict__."""
    try:
        pprint_data(data.__dict__, label=label, fg=fg, bg=bg)
    except Exception as exc:
        raise exc

def pprint_breakpoint(label="BREAK POINT", symbol="*"):
    """Print a break point line."""
    print()
    pprint_label(label, symbol="*", symbol_repetition=30, bg="red")
    print()

def pprint_locals(local_vars):
    """Pretty print local variables `local_vars` from locals() returned dictionary.
    
    Sample invocation:
        pprint_locals(locals())
    """
    pprint_data(local_vars, label="Local Variables")


def print_debug_multiline(label, exc_obj, exc_type, code, location, line_no, bg):
    """Print exception info nicely in multilines with label."""
    try:
        print()
        pprint_label(label, bg=bg)
        print("Exception:", make_bold(str(exc_obj), fg=bg))
        print("Type:", make_bold(exc_type, fg=bg)) 
        print("Function/Method/Caller:", make_bold(code, fg=bg))
        print("Location:", make_bold(location, fg=bg))
        print("Line:", make_bold(line_no, fg=bg))
        pprint_symbols(symbol_repetition=42 + len(label), bg=bg)
    except Exception as exc:
        pass

def print_debug_single_line(exc_obj, exc_type, location, code, line_no, bg):
    """Print exception info in single line with bg background."""
    try:
        one_line_error = "{} {} {} Caller: {}() Line: {}".format(
           exc_obj, 
           exc_type,
           location,  
           code, 
           line_no
        )
        print(colorize(one_line_error, opts=("bold", "underscore"), fg=bg))
    except Exception as exc:
        pass


def debug_exception(exc, label="Exception Occurred", bg="red"):
    """Print exception and traceback info for devs to debug.
    
    NOTE: This should be called on the context of an except clause:
    ..
    except Exception as exc:
        debug_exception(exc)
    ..

    https://docs.python.org/3/library/sys.html#sys.exc_info
    """
    try:
        exc_type, exc_obj, exc_traceback = sys.exc_info()
        exc_frame = exc_traceback.tb_frame
        f_code = exc_frame.f_code
        
        code = f_code.co_name
        location = f_code.co_filename.split(str(settings.BASE_DIR))[1]
        line_no = exc_traceback.tb_lineno

        if settings.DEBUG_MULTILINE:
            print_debug_multiline(label, exc_obj, exc_type, code, location, line_no, bg)
        else:
            print_debug_single_line(exc_obj, exc_type, location, code, line_no, bg)
    
    except Exception as e:
        pprint_data(exc, "An exception occurred", bg="red")

def debugger(message="Paused in debugger"):
    """Stop execution, mimiced from javascript `debugger` statement."""
    raise RuntimeError(message)
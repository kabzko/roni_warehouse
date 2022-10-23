def beautify_serializer_error(errors) -> str:
    """Extract model serializers error and return beautiful string HTML format.
    
    Parameters:
    --------------
    errors - ReturnDict or OrderDict.
    """

    message = "<ul style='margin: 0 !important'>"

    for key in errors:
        for error in errors[key]:
            message += "<li>{}</li>".format(error)

    message += "</ul>"
    return message
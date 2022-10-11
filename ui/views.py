from django.http import HttpResponse
from django.shortcuts import (
    render,
    redirect
)

from utils.debug import *

def index(request):
    """Landing page view."""
    try:
        is_allow_pages = any((
            "/web/login/" == request.path,
            "/web/login" == request.path,
            "/web/" == request.path,
            "/web" == request.path,
            "/" == request.path
        ))

        if request.user.is_authenticated and is_allow_pages:
            if request.user.user_type == "admin":
                return redirect("/web/dashboard/admin/")
            elif request.user.user_type == "cashier":
                return redirect("/web/dashboard/cashier/")

        is_redirect = all((
            not request.user.is_authenticated,
            not is_allow_pages,
        ))

        if is_redirect:
            return redirect("/web/login/")

        return render(request, "index.html")
    except Exception as exc:
        debug_exception(exc)
        return HttpResponse("Please contact the administrator!", status_code=400)
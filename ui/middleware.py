from django.shortcuts import redirect
from django.db.models import Q

class RouteGuardMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        """Check routes if has access"""
        
        if not hasattr(request, "user"):
            return redirect("/")
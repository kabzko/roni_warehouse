import json
import datetime
import calendar

from django.db.models import Q, Count, Sum, F
from django.db.models.functions import TruncDay

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.cart import Cart
from app.serializers.cart import CartSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class LeaderboardsAPIView(API):
    """"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            leaderboards = []
            query = request.GET.dict()
            filters = Q()
            
            if query.get("type") == "daily":
                date = f"{query.get('year')}-{query.get('month')}-{query.get('day')}"
                filters = Q(created_at__date=date)
            else:
                filters = Q(created_at__year=query.get("year"), created_at__month=query.get("month"))

            leaderboards = Cart.objects.filter(filters).values("product").annotate(total_quantity=Sum("quantity"))

            return self.success_response(leaderboards)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
from django.urls import path
from .views.distance import distance
from .views.bearing import bearing
from .views.star import star
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('distance', distance, name="distance"),
    path('bearing', bearing, name="bearing"),
    path('star', star, name="star"),
]

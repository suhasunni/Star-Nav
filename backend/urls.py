from django.urls import path
from .views.distance import distance
from .views.bearing import bearing
from .views.star import star

urlpatterns = [
    path('distance', distance, name="distance"),
    path('bearing', bearing, name="bearing"),
    path('star', star, name="star"),
]

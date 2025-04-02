from ..calculations.astronomy import get_best_star
from django.http import JsonResponse

def star(request):
    """ returns the star in direction of destination """
    obs_lat = request.GET.get('obs_lat', False)
    obs_lon = request.GET.get('obs_lon', False)
    target_azimuth = request.GET.get('target_azimuth', False)

    if (not obs_lat 
        or not obs_lon 
        or not target_azimuth
    ):
        return JsonResponse({
            "result": "error",
            "error": "1 or more parameters not found."
        })

    obs_lat, obs_lon, target_azimuth = float(obs_lat), float(obs_lon), float(target_azimuth)

    return JsonResponse(get_best_star(obs_lat, obs_lon, target_azimuth))
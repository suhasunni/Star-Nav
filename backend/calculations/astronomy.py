from math import radians, degrees, asin, sin, cos, atan2
from skyfield.api import load, wgs84
from skyfield.data import hipparcos
from typing import Dict, Union
from .commonStarNames import get_star_name

def azimuth_of_star(obs_latitude: float, obs_longitude: float, end_declination, end_right_ascension):
    """calculate the azimuth (bearing) of a star given an observers position and current time"""
    time = load.timescale().now()
    obs_latitude, obs_longitude = radians(obs_latitude), radians(obs_longitude)

    #calculate hour angle
    observer_pos = wgs84.latlon(degrees(obs_latitude), degrees(obs_longitude))
    hour_angle = radians(observer_pos.lst_hours_at(time)*15 - end_right_ascension)

    end_declination, end_right_ascension = radians(end_declination), radians(end_right_ascension)

    #calculate altitude of object
    altitude = asin(sin(obs_latitude)*sin(end_declination) + cos(obs_latitude)*cos(end_declination)*cos(hour_angle))

    sin_azimuth = (cos(end_declination)*sin(hour_angle)) / cos(altitude)
    cos_azimuth = (sin(end_declination) - sin(obs_latitude)*sin(altitude)) / (cos(obs_latitude)*cos(altitude))

    azimuth = (degrees(atan2(sin_azimuth, cos_azimuth)) + 360) % 360

    return azimuth

def get_best_star(obs_latitude: float, obs_longitude: float, target_azimuth: float) -> Dict[str, Union[int, str, None, float]]:
    """ calculates star with closest azimuth to destination """
    
    with load.open(hipparcos.URL) as f:
        all_stars = hipparcos.load_dataframe(f)
    
    visible_stars = all_stars[all_stars["magnitude"] <= 3]

    response = {
        "hipparcos number": False,
        "star name": False,
        "azimuth error": float("inf")
    }

    for hipparcos_number, star in visible_stars.iterrows():
        current_azimuth = azimuth_of_star(obs_latitude, obs_longitude, star.dec_degrees, star.ra_degrees)

        if abs(target_azimuth - current_azimuth) < response["azimuth error"]:
            response = {
                "hipparcos number": hipparcos_number,
                "star name": get_star_name(hipparcos_number),
                "azimuth error": abs(target_azimuth-current_azimuth)
            }
    return response
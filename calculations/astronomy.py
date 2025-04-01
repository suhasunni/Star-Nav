from math import radians, degrees, asin, sin, cos, atan2
from skyfield.api import load, wgs84

def azimuth_of_star(obs_latitude: float, obs_longitude: float, obj_declination, obj_right_ascension):
    """calculate the azimuth (bearing) of a star given an observers position and current time"""
    time = load.timescale().now()
    obs_latitude, obs_longitude = radians(obs_latitude), radians(obs_longitude)

    #calculate hour angle
    observer_pos = wgs84.latlon(degrees(obs_latitude), degrees(obs_longitude))
    hour_angle = radians(observer_pos.lst_hours_at(time)*15 - obj_right_ascension)

    obj_declination, obj_right_ascension = radians(obj_declination), radians(obj_right_ascension)

    #calculate altitude of object
    altitude = asin(sin(obs_latitude)*sin(obj_declination) + cos(obs_latitude)*cos(obj_declination)*cos(hour_angle))

    sin_azimuth = (cos(obj_declination)*sin(hour_angle)) / cos(altitude)
    cos_azimuth = (sin(obj_declination) - sin(obs_latitude)*sin(altitude)) / (cos(obs_latitude)*cos(altitude))

    azimuth = (degrees(atan2(sin_azimuth, cos_azimuth)) + 360) % 360

    return azimuth
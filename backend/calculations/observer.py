from math import radians, sin, cos, asin, sqrt, atan2, degrees
from skyfield.api import wgs84, load

def distance_to(obs_latitude: float, obs_longitude: float, final_latitude: float, final_longitude: float) -> float:
    """haversine formula to calculate shortest great-circle distance between the observer and a point"""
    earth_radius = 6378.14

    obs_latitude, obs_longitude = radians(obs_latitude), radians(obs_longitude)
    final_latitude, final_longitude = radians(final_latitude), radians(final_longitude)

    radicand = sin((final_latitude - obs_latitude)/2.0)**2 + cos(obs_latitude)*cos(final_latitude)*sin((final_longitude - obs_longitude)/2.0)**2
    
    return 2*earth_radius*asin(sqrt(radicand))

def bearing_to(obs_latitude: float, obs_longitude: float, end_latitude: float, end_longitude: float) -> float:
    """calculate inital heading angle between two points on earth"""
    obs_latitude, obs_longitude = radians(obs_latitude), radians(obs_longitude)
    end_latitude, end_longitude = radians(end_latitude), radians(end_longitude)

    azimuth_rad = atan2(sin(end_longitude-obs_longitude)*cos(end_latitude), 
                        cos(obs_latitude)*sin(end_latitude)-sin(obs_latitude)*cos(end_latitude)*cos(end_longitude-obs_longitude))
    azimuth_deg = (degrees(azimuth_rad) + 360) % 360

    return azimuth_deg

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
from math import radians, cos, sin, asin, sqrt, atan2, degrees

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
from math import radians, sin, cos, asin, sqrt, atan2, degrees
from skyfield.api import wgs84, load

class Observer:

    def __init__(self, latitude: float, longitude: float):
        #angles must be passed in degrees
        self.latitude = radians(latitude) 
        self.longitude = radians(longitude)
        self.time = load.timescale().now()

    def distance_to(self, final_latitude: float, final_longitude: float) -> float:
        """haversine formula to calculate shortest great-circle distance between the observer and a point"""
        earth_radius = 6378.14

        final_latitude, final_longitude = radians(final_latitude), radians(final_longitude)

        radicand = sin((final_latitude - self.latitude)/2.0)**2 + cos(self.latitude)*cos(final_latitude)*sin((final_longitude - self.longitude)/2.0)**2
        
        return 2*earth_radius*asin(sqrt(radicand))

    def bearing_to(self, end_latitude: float, end_longitude: float) -> float:
        """calculate inital heading angle between two points on earth"""
        end_latitude, end_longitude = radians(end_latitude), radians(end_longitude)

        azimuth_rad = atan2(sin(end_longitude-self.longitude)*cos(end_latitude), 
                            cos(self.latitude)*sin(end_latitude)-sin(self.latitude)*cos(end_latitude)*cos(end_longitude-self.longitude)
                    )
        azimuth_deg = (degrees(azimuth_rad) + 360) % 360

        return azimuth_deg

    def azimuth_of_star(self, obj_declination, obj_right_ascension):
        """calculate the azimuth (bearing) of a star given an observers position and current time"""
        time = load.timescale().now()

        #calculate hour angle
        observer_pos = wgs84.latlon(degrees(self.latitude), degrees(self.longitude))
        hour_angle = radians(observer_pos.lst_hours_at(time)*15 - obj_right_ascension)

        obj_declination, obj_right_ascension = radians(obj_declination), radians(obj_right_ascension)

        #calculate altitude of object
        altitude = asin(sin(self.latitude)*sin(obj_declination) + cos(self.latitude)*cos(obj_declination)*cos(hour_angle))

        sin_azimuth = (cos(obj_declination)*sin(hour_angle)) / cos(altitude)
        cos_azimuth = (sin(obj_declination) - sin(self.latitude)*sin(altitude)) / (cos(self.latitude)*cos(altitude))

        azimuth = (degrees(atan2(sin_azimuth, cos_azimuth)) + 360) % 360

        return azimuth
from skyfield.api import load 
from skyfield.data import hipparcos
from geometry import distance_to, bearing_to
from astronomy import azimuth_of_star
from commonStarNames import get_star_name

obs = {"lat": 3.73, "lon": -79.76}
destination = {"lat": 40.71, "lon": -74}

bearing = bearing_to(obs["lat"], obs["lon"], destination["lat"], destination["lon"])
distance = distance_to(obs["lat"], obs["lon"], destination["lat"], destination["lon"])

print(bearing, distance)

with load.open(hipparcos.URL) as f:
    df = hipparcos.load_dataframe(f)

visible_stars = df[df["magnitude"] <= 3]
best = [float("inf"), None]

for index, star in visible_stars.iterrows():
    az_star = azimuth_of_star(obs["lat"], obs["lon"], star.dec_degrees, star.ra_degrees)
    if abs(bearing-az_star) <= best[0]:
        best = [abs(bearing-az_star), index]
print("final: ", get_star_name(best[1]), " error: ", best[0])
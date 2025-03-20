from skyfield.api import load 
from skyfield.data import hipparcos
from observer import Observer

guy = Observer(43.7315, -79.7624)

with load.open(hipparcos.URL) as f:
    df = hipparcos.load_dataframe(f)

visible_stars = df[df["magnitude"] < 6]
best = [None, float('inf')]

print(visible_stars.columns)

for index, star in visible_stars.iterrows():
    az = guy.azimuth_of_star(star.dec_degrees, star.ra_degrees)
    if az <= best[1]:
        best = [index, az]

print(best)
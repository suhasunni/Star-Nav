import { useContext, useState, FormEvent, useMemo, useRef } from "react";
import { startLatLonContext } from "../app";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "./start.css";
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router-dom";
import { Marker as LeafletMarker } from 'leaflet';


function Start() {
    
    const context = useContext(startLatLonContext);
    const navigator = useNavigate();

    if (!context) {
        throw Error("no starting postion");
    }

    const [startLatLon, setStartLatLon] = context;
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");

    function DraggableLocationMarker() {
        const map = useMapEvents({
            click() {
                map.locate();
            }, 
            locationfound(e) {
                setStartLatLon([e.latlng.lat, e.latlng.lng]);
                map.flyTo(e.latlng, 13);
            }
        });
        
        const markerRef = useRef<LeafletMarker>(null)
        const eventHandlers = useMemo(
            () => ({
              dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    const latlng = marker.getLatLng();
                    setStartLatLon([latlng.lat, latlng.lng])
                }
              },
            }),
            [setStartLatLon],
          )


        return startLatLon === null ? null : (
            <Marker 
            ref={markerRef}
            eventHandlers={eventHandlers}
            draggable={true}
            position={startLatLon}/>
          )
    }
    
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (lat === "" || lon === ""){
            alert("Please enter the latitude and longitude!");
            return;
        }
        
        if (   parseFloat(lat) < -90 
            || parseFloat(lat) > 90 
            || parseFloat(lon) < -180
            || parseFloat(lon) > 180
        )
        {
            alert("Invalid latitude and/or longitude cordinates!");
            return;
        }
        setStartLatLon([parseFloat(lat),parseFloat(lon)]);
    }

    return (
        <div className="page">
            <div className="above-above-map">
                <h2>Where Will You Be Starting Your Journey?</h2>
                <p>click anywhere on the map to locate yourself or enter cordinates yourself</p>
            </div>
            <div >
                <form className="above-map" onSubmit={e => handleFormSubmit(e)}>
                    <input value={lat} onChange={e => setLat(e.target.value)} placeholder="latitude"/>
                    <input value={lon} onChange={e => setLon(e.target.value)} placeholder="longitude"/>
                    <button>GO</button>
                </form>
            </div>
            <div className="map">
                <MapContainer
                    center={startLatLon}
                    zoom={11}
                    scrollWheelZoom={true}
                    >
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableLocationMarker/>
                </MapContainer>
                <button className="next" onClick={() => navigator("/target")}>
                    NEXT
                </button>
            </div>
        </div>
    ); 
}
export default Start
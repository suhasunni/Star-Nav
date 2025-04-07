import "./target.css"
import { endLatLonContext, startLatLonContext } from "../app"
import { FormEvent, useContext, useState, useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Marker as LeafletMarker } from 'leaflet';



function Target() {
    const endContext = useContext(endLatLonContext);
    const startContext = useContext(startLatLonContext);
    const navigator = useNavigate();
    
    if (!endContext || !startContext) {
        throw Error("no starting postion");
    }
    
    const [endLatLon, setEndLatLon] = endContext;
    const [startLatLon, setStartLatLon] = startContext;
    
    useEffect(() => {
        if (startLatLon) {
            setEndLatLon([startLatLon[0]+0.05, startLatLon[1]+0.05]);
        }
    }, [startLatLon, setEndLatLon]);

    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");

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
        setEndLatLon([parseFloat(lat),parseFloat(lon)]);
    }

    function StartMarker() {
        
        const startRef = useRef<LeafletMarker>(null);

        useEffect(() => {
            if (startRef.current !== null) {
                startRef.current.openPopup();
            }
        }, []);
        
        const map = useMapEvents({
            click() {
                map.flyTo([startLatLon[0], startLatLon[1]], 13);
            }
        });
        return startLatLon === null ? null : (
            <Marker 
            draggable={false}
            position={startLatLon}
            ref={startRef}>
                <Popup>
                    Start Destination
                </Popup>
            </Marker>
            )
    }
    
    function DraggableLocationMarker() {
        
        const endRef = useRef<LeafletMarker>(null);

        useEffect(() => {
            if (endRef.current !== null) {
                endRef.current.openPopup();
            }
        }, []);
    
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                const marker = endRef.current
                if (marker != null) {
                    const latlng = marker.getLatLng();
                    setEndLatLon([latlng.lat, latlng.lng])
                }
                },
            }),
            [setEndLatLon],
            )

        return endLatLon === null ? null : (
            <Marker 
            ref={endRef}
            eventHandlers={eventHandlers}
            draggable={true}
            position={endLatLon}>
                <Popup>
                    End Destination
                </Popup>
            </Marker>
            )
    }


    return (
      <div className="page">
            <div className="above-above-map">
                <h2>Where is Your Destination?</h2>
                <p>drag or enter cordinates of your destination</p>
                <p>click anywhere to see your starting location</p>
            </div>
            <div >
                <form className="above-map" onSubmit={e => handleFormSubmit(e)}>
                    <input value={lat} onChange={e => setLat(e.target.value)} placeholder="latitude"/>
                    <input value={lon} onChange={e => setLon(e.target.value)} placeholder="longitude"/>
                    <button>GO</button>
                </form>
            </div>
            <div className="map">
                <button className="prev" onClick={() => navigator("/")}>
                    BACK
                </button>
                <MapContainer
                    center={startLatLon}
                    zoom={11}
                    scrollWheelZoom={true}
                    >
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <StartMarker/>
                    <DraggableLocationMarker/>
                </MapContainer>
                <button className="next" onClick={() => navigator("/star")}>
                    GET DIRECTIONS
                </button>
            </div>
        </div>  
    );
}
export default Target
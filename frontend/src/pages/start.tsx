import { useContext, useEffect } from "react";
import { startLatLonContext } from "../app";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "./start.css"
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from "leaflet";


function Start() {
    
    const context = useContext(startLatLonContext)
    
    if (!context) {
        throw Error("no starting postion")
    }

    const [startLatLon, setStartLatLon] = context;
    
    const handleClick = () => {
        const map = useMap();
        const currentLocation: LatLngTuple = [43.41, -79.5];
        setStartLatLon(currentLocation);
        map.flyTo(currentLocation, 13, {duration: 2});
    }
    

    useEffect(() => {
        
    }, [startLatLon]);

    return (
        <div className="page">
            <div className="above-above-map">
                <h2>Where Will You Be Starting Your Journey?</h2>
                <p>click the marker to locate yourself or enter the cordinates</p>
            </div>
            <div className="above-map">
                <input placeholder="latitude"/>
                <input placeholder="longitude"/>
            </div>
            <MapContainer
                center={startLatLon}
                zoom={11}
                scrollWheelZoom={true}
                >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            
            </MapContainer>
        </div>
    ); 
}
export default Start
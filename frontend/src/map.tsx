import { LatLng, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './map.css'

function Map() {
    

    
    const startPosition: LatLngExpression = [43,-77]
    const [position, setPosition] = useState<LatLngExpression>(startPosition);
    
    function LocationMarker() {
        const [position, setPosition] = useState(startPosition)
        const map = useMapEvents({
          click() {
            map.locate()
          },
          locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
          },
        })
      
        return position === null ? null : (
          <Marker position={position}>
            <Popup>{position.toString()}</Popup>
          </Marker>
        )
      }

    return (
        <MapContainer
        center={{ lat: 43, lng: -77 }}
        zoom={13}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    )

}
export default Map
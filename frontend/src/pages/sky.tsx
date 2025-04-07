import { endLatLonContext, startLatLonContext } from "../app";
import { useContext, useEffect, useState } from "react";
import "./sky.css"

function Sky() {
    
    const startContext = useContext(startLatLonContext);
    const endContext = useContext(endLatLonContext);

    if (!startContext || !endContext) {
        alert("No Starting or Ending Position!");
        throw Error("No Starting or Ending Position!");
    }

    const [startLatLon, setStartLatLon] = startContext;
    const [endLatLon, setEndLatLon] = endContext;
    const [bearing, setBearing] = useState(null);
    const [starNumber, setStarNumber] = useState(null);
    const [starName, setStarName] = useState(null);

    
    const API_URL = "http://127.0.0.1:8000/";
    
    useEffect(() => {
        fetch(`${API_URL}/bearing?obs_lat=${startLatLon[0]}&obs_lon=${startLatLon[1]}&end_lat=${endLatLon[0]}&end_lon=${endLatLon[1]}`)
            .then(res => res.json())
            .then(data => setBearing(data.result));
    }, []);

    useEffect(() => {
        if (bearing === null) return;
        fetch(`${API_URL}/star?obs_lat=${startLatLon[0]}&obs_lon=${startLatLon[1]}&target_azimuth=${bearing}`)
            .then(res => res.json())
            .then(data => { 
                setStarNumber(data.result["hipparcos number"]); 
                setStarName(data.result["star name"])
            });

    }, [bearing]);




    return (
        <h1> {starNumber} {starName} </h1>

    );
}
export default Sky
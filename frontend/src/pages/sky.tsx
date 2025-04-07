import { endLatLonContext, startLatLonContext } from "../app";
import { useContext, useEffect, useState } from "react";
import "./sky.css"
import { useNavigate } from "react-router-dom";

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
    const [distance, setDistance] = useState(null);

    const navigator = useNavigate();


    
    const API_URL = "http://127.0.0.1:8000/";
    
    // get bearing to destination
    useEffect(() => {
        fetch(`${API_URL}/bearing?obs_lat=${startLatLon[0]}&obs_lon=${startLatLon[1]}&end_lat=${endLatLon[0]}&end_lon=${endLatLon[1]}`)
            .then(res => res.json())
            .then(res => setBearing(res.result));
    }, []);

    // calculation optimal star
    useEffect(() => {
        if (bearing === null) return;
        fetch(`${API_URL}/star?obs_lat=${startLatLon[0]}&obs_lon=${startLatLon[1]}&target_azimuth=${bearing}`)
            .then(res => res.json())
            .then(res => { 
                setStarNumber(res.result["hipparcos number"]); 
                setStarName(res.result["star name"])
            });

    }, [bearing]);

    // calculate time of travel
    useEffect(() => {
        fetch(`${API_URL}/distance?obs_lat=${startLatLon[0]}&obs_lon=${startLatLon[1]}&end_lat=${endLatLon[0]}&end_lon=${endLatLon[1]}`)
            .then(res => res.json())
            .then(res => setDistance(res.result));
    }, []);

    return (
        <div className="sky-container">
            <h1>🚀 Star-Nav: Final Coordinates Locked In 🚀</h1>
            {starNumber === null ? (
            <h3>Calculating the best star for your journey...</h3>
            ) : (
                <div>
                    <h3>
                    🧭 The cosmos has spoken. To reach your destination, journey by the light of {"     "}
                    <strong>
                            {starName ? <span style={{ fontSize: "1.5em" }}>Polaris</span> : `the star catalogued as Hipparcos ${starNumber}`}
                    </strong>.
                    </h3>
                    
                </div>
            )}

            {distance === null ? (
                <h3>Calculating the trip length of your journey...</h3>
            ) : ( <>
                <h3>
                    Your trip will take around approximately {((distance/4)*60).toFixed()} minutes.
                </h3>
                <h3>✨ Let this star be your beacon across the night sky. Safe travels, navigator. ✨</h3>
                </>)
            }

            <button onClick={() => navigator("/target")}>
                GO BACK
            </button>
        </div>
    );
}
export default Sky
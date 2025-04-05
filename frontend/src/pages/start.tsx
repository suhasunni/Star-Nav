import { useContext } from "react";
import { startLatLonContext } from "../app";

function Start() {
    
    const context = useContext(startLatLonContext)
    
    if (!context) {
        throw Error("no starting postion")
    }

    const [startLatLon, setStartLatLon] = context;
    setStartLatLon([1,1]);
    return <h1>lat: {startLatLon[0]}. long: {startLatLon[1]}</h1>;
}
export default Start
import "./target.css"
import { startLatLonContext } from "../app"
import { useContext } from "react";

function Target() {
    const context = useContext(startLatLonContext);
    if (!context) {
        throw Error("no starting postion")
    }
    const [test, setTest] = context;
    
    
    return (
        <div>
            <h1>{test}</h1>
        </div>
    )
}
export default Target
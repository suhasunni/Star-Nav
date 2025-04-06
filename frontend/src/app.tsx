import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from './pages/start';
import Target from './pages/target';
import Sky from './pages/sky';
import React, { createContext, useState } from 'react';
import { LatLngTuple } from "leaflet";

export const startLatLonContext = createContext<[LatLngTuple, React.Dispatch<React.SetStateAction<LatLngTuple>>] | null>(null);
export const endLatLonContext = createContext<[LatLngTuple, React.Dispatch<React.SetStateAction<LatLngTuple>>] | null>(null);

function App() {
    
    const [ startLatLon, setStartLatLon ] = useState<LatLngTuple>([43, -77]);
    const [ endLatLon, setEndLatLon ] = useState<LatLngTuple>([45, -77]);
    
    
    return (
        <BrowserRouter>
            <endLatLonContext.Provider value={[endLatLon, setEndLatLon]}>
                <startLatLonContext.Provider value={[startLatLon, setStartLatLon]}>
                    <div className="bg">
                        <Routes>
                            <Route path="/" element={<Start/>}/>
                            <Route path="/target" element={<Target/>}/>
                            <Route path="/sky" element={<Sky/>}/>
                        </Routes>
                    </div>
                </startLatLonContext.Provider>
            </endLatLonContext.Provider>  
        </BrowserRouter>
    )
}
export default App;
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
//Mapcontainer "is the main frame whole frame like a painting frame"
//TitleLayer "this is used to fetch the streets and its labels like location"
//Marker "this is used to mark a specific location on the map"
//Popup "this is used to show the info of particular location when we click on the marker"
//all these are componets provided by react-leaflet library think react-leaftlet as a box and inside box we get mapcontainer and all etc.
import "leaflet/dist/leaflet.css" //import things from nodemodules->leafletfolder->dist->leaflet.css tell how to preoply put marker where 
import L from 'leaflet' //importing leaflet library as L do all deep logic work
import { useState, useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Emoji icon for the Traffic Signal
const signalEmoji = (state) => L.divIcon({
    html: `<div style="font-size: 30px;">${state === "GREEN" ? "🟢" : "🔴"}</div>`,
    className: 'dummy',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Emoji icon for the Ambulance
const ambulanceEmoji = L.divIcon({
    html: `<div style="font-size: 30px;">🚑</div>`,
    className: 'dummy',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


function MapView() {
    const center = [9.9930419, 76.3017048]; // Jln stadium is what i gave
    const route = [
        [9.9908649, 76.3021516],
        [9.9911956, 76.3021332],
        [9.9916629, 76.3020623],
        [9.9922232, 76.3019409],
        [9.9923517, 76.3019267],
        // [9.9930340, 76.3018243],
        [9.9930340, 76.3018243],
        [9.9933433, 76.3017846],
        [9.9944848, 76.3016587],
        [9.9954740, 76.3014861],
        [9.9960327, 76.3013843],


    ];

    const [segmentIndex, setsegmentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(route[0]);
    const [criticality, setCriticality] = useState("CRITICAL");
    const [signalState, setsignalState] = useState("RED");
    const signalpos = [9.9933433, 76.3017846];

    const getThresholdDistance = () => {
        if (criticality === "STABLE") return 40;
        if (criticality === "CRITICAL") return 80;
        if (criticality === "VERY CRITICAL") return 120;
        return 60;
    }

    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };


    useEffect(() => {
        const speed = 0.02;
        const interval = setInterval(() => {
            const [lat1, lng1] = route[segmentIndex];
            const [lat2, lng2] = route[segmentIndex + 1];

            const newProgress = progress + speed;
            let lat, lng;

            if (newProgress >= 1) {
                if (segmentIndex < route.length - 2) {
                    setsegmentIndex(segmentIndex + 1);
                    setProgress(0);
                    setCurrentPosition(route[segmentIndex + 1]);
                    [lat, lng] = route[segmentIndex + 1];
                }
                else {
                    clearInterval(interval);
                    return;
                }
            }
            else {
                setProgress(newProgress);

                lat = lat1 + (lat2 - lat1) * newProgress;
                lng = lng1 + (lng2 - lng1) * newProgress;

                setCurrentPosition([lat, lng]);
            }

            const distanceToSignal = getDistanceInMeters(lat, lng, signalpos[0], signalpos[1]);

            const threshold = getThresholdDistance();

            if (distanceToSignal <= threshold) {
                setsignalState("GREEN");
            }
            else {
                setsignalState("RED");
            }
        }, 100);

        return () => clearInterval(interval);
    }, [segmentIndex, progress, criticality]);


    return (
        <div>
            <div style={{
                position: 'absolute',
                top: 10,
                left: 50,
                zIndex: 1000,
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
            }}>
                <button onClick={() => {
                    setCriticality("STABLE");
                }}>STABLE</button>
                <button onClick={() => {
                    setCriticality("CRITICAL");
                }}>CRITICAL</button>
                <button onClick={() => {
                    setCriticality("VERY CRITICAL");
                }}>VERY CRITICAL</button>

            </div>
            <MapContainer center={center} zoom={15} style={{ height: "100vh", width: "100vw" }}>

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

                <Marker position={currentPosition} icon={ambulanceEmoji}>
                    <Popup>
                        <b>Ambulance</b><br />
                        Criticality: {criticality}
                    </Popup>
                </Marker>

                <Marker position={signalpos} icon={signalEmoji(signalState)}>
                    <Popup>
                        <b>Traffic Signal</b><br />
                        State: {signalState}
                    </Popup>
                </Marker>



            </MapContainer>
        </div>
    )

}

export default MapView
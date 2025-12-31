import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
//Mapcontainer "is the main frame whole frame like a painting frame"
//TitleLayer "this is used to fetch the streets and its labels like location"
//Marker "this is used to mark a specific location on the map"
//Popup "this is used to show the info of particular location when we click on the marker"
//all these are componets provided by react-leaflet library think react-leaftlet as a box and inside box we get mapcontainer and all etc.
import "leaflet/dist/leaflet.css" //import things from nodemodules->leafletfolder->dist->leaflet.css tell how to preoply put marker where 
import L from 'leaflet' //importing leaflet library as L do all deep logic work

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});



function MapView() {
    const center = [9.9973,76.3009]; // Jln stadium is what i gave
    return (
        <MapContainer center={center} zoom={13} style={{height : "100vh",width : "100vw"}}>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors"/>

        <Marker position={center}>
            <Popup>Here I am</Popup>
        </Marker>

        </MapContainer>
    )
}

export default MapView
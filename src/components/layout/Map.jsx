"use client"; // if using Next 13 app directory

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIconPng from "leaflet/dist/images/marker-icon.png";

const Map = ({ lat = 51.505, lng = -0.09, zoom = 13 }) => {
    return (
        <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lat, lng]} icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup>
                    A marker at {lat}, {lng}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;

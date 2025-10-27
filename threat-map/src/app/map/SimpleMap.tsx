import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RootLayout from '../layout';

export default function SimpleMap() {
  return (
    <RootLayout>
    <MapContainer center={[48.85, 2.35]} zoom={5} className="h-screen w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[48.85, 2.35]}>
        <Popup>Paris 🇫🇷</Popup>
      </Marker>
    </MapContainer>
    </RootLayout>
  );
}

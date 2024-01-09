import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapComponent.scss";
import CardForRent from "../cardForRent/CardForRent";
// import { useMapContext } from "../MapProvider";
import axios from "axios";

const MapComponent = () => {
  const initialPosition = [50.4501, 30.5234];
  const [iconColor, setIconColor] = useState("#CEFF7B");
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);

  const getCustomMarkerIcon = (color) => {
    return L.divIcon({
      html: `<svg width="21" height="30" viewBox="0 0 21 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_5210_39761)">
      <path d="M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0ZM10.5 14.25C9.50544 14.25 8.55161 13.8549 7.84835 13.1517C7.14509 12.4484 6.75 11.4946 6.75 10.5C6.75 9.50544 7.14509 8.55161 7.84835 7.84835C8.55161 7.14509 9.50544 6.75 10.5 6.75C11.4946 6.75 12.4484 7.14509 13.1517 7.84835C13.8549 8.55161 14.25 9.50544 14.25 10.5C14.25 11.4946 13.8549 12.4484 13.1517 13.1517C12.4484 13.8549 11.4946 14.25 10.5 14.25Z" fill="${color}" fill-opacity="0.8"/>
      <path d="M10.5 29.2426C10.4769 29.2158 10.4527 29.1879 10.4276 29.1588C10.1433 28.8288 9.73635 28.3477 9.2476 27.7455C8.26967 26.5405 6.96658 24.8534 5.66448 22.9235C4.36142 20.9922 3.06553 18.8268 2.09693 16.6647C1.12539 14.4961 0.5 12.3676 0.5 10.5C0.5 4.97114 4.97114 0.5 10.5 0.5C16.0289 0.5 20.5 4.97114 20.5 10.5C20.5 12.3676 19.8746 14.4961 18.9031 16.6647C17.9345 18.8268 16.6386 20.9922 15.3355 22.9235C14.0334 24.8534 12.7303 26.5405 11.7524 27.7455C11.2637 28.3477 10.8567 28.8288 10.5724 29.1588C10.5473 29.1879 10.5231 29.2158 10.5 29.2426ZM7.4948 13.5052C8.29183 14.3022 9.37283 14.75 10.5 14.75C11.6272 14.75 12.7082 14.3022 13.5052 13.5052C14.3022 12.7082 14.75 11.6272 14.75 10.5C14.75 9.37283 14.3022 8.29183 13.5052 7.4948C12.7082 6.69777 11.6272 6.25 10.5 6.25C9.37283 6.25 8.29183 6.69777 7.4948 7.4948C6.69777 8.29183 6.25 9.37283 6.25 10.5C6.25 11.6272 6.69777 12.7082 7.4948 13.5052Z" stroke="#646D85" stroke-opacity="0.4"/>
      </g>
      <defs>
      <clipPath id="clip0_5210_39761">
      <rect width="21" height="30" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      `,
    });
  };

  const customMarkerIcon = getCustomMarkerIcon(iconColor);

  const handleMarkerClick = (carData) => {
    const updatedMarkers = markers.map((marker) => {
      if (marker.car.id === carData.id) {
        return {
          ...marker,
          marker: setIconColor("#000"),
        };
      }
      return marker;
    });
  
    setMarkers(updatedMarkers);
  
    const isSelected = selectedCars.some(
      (selectedCar) => selectedCar.id === carData.id
    );
  
    if (isSelected) {
      setSelectedCars(
        selectedCars.map((selectedCar) =>
          selectedCar.id === carData.id ? carData : selectedCar
        )
      );
    } else {
      setSelectedCars([...selectedCars, carData]);
    }
  };
  
  const handleMapClick = () => {
    setIconColor("#CEFF7B");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getAllCars"
        );
        setData(response.data.cars);
        setMarkers(
          response.data.cars.map((car) => ({
            position: [car.latitude, car.longitude],
            car,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Button href="/rent-form" variant="contained" sx={{margin: '20px'}}>
        <AddIcon />
        Подати оголошення
      </Button>
      <div onClick={handleMapClick}>
        <MapContainer
          center={initialPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="map-style"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, id) => (
            <Marker
              key={id}
              position={marker.position}
              icon={customMarkerIcon}
              eventHandlers={{ click: () => handleMarkerClick(marker.car) }}
              bubblingMouseEvents
            />
          ))}
        </MapContainer>
      </div>

      {selectedCars.length > 0 && (
      <CardForRent carData={selectedCars[selectedCars.length - 1]} />
    )}
    </>
  );
};

export default MapComponent;

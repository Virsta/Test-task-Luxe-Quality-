import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const useMapContext = () => {
  return useContext(MapContext);
};

export const MapProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  const addMarker = (marker) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  return (
    <MapContext.Provider value={{ markers, addMarker }}>
      {children}
    </MapContext.Provider>
  );
};

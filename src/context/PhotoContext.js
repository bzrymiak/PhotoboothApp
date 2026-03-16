//HOLD PHOTOS ARRAY AND MANAGE PHOTO ADDING/DELETING FUNCTIONS
// can edit, this is just taken from class

import { createContext, useContext, useState } from "react";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  // const [strips, setStrips] = useState([]);

  const addPhoto = (uri) => {
    setPhotos((prev) => [uri, ...prev]);
  };

  const deletePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, deletePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

// custom hook for easy access
export function usePhotos() {
  return useContext(PhotoContext);
}

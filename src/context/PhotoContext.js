//HOLD PHOTOS ARRAY AND MANAGE PHOTO ADDING/DELETING FUNCTIONS
import { createContext, useContext, useState } from "react";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);

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

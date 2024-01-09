import React, { useState, useEffect } from "react";
import axios from "axios";

export const PhotoComponent = ({ imageName }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`/api/uploads/${imageName}`, {
          responseType: "arraybuffer",
        });

        const blob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrlObject = URL.createObjectURL(blob);

        setImage(imageUrlObject);
      } catch (error) {
        console.error("Error fetching image:", error);
        setError("Error fetching image");
      }
    };

    fetchImage();
  }, [imageName]);

  return (
    <div>
      {error && <p>{error}</p>}
      {image && <img src={image} alt="Vehicle" />}
    </div>
  );
};

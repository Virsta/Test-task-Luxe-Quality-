import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "../../styles/index.scss";
// import { useMapContext } from "../MapProvider";

const Form = ({ onAddMarker }) => {
  const [message, setMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // const { addMarker } = useMapContext();
  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      minCost: "",
      city: "",
      imageUrl: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      subtitle: Yup.string().required("Required"),
      minCost: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (!selectedFile) {
          console.error("No file selected");
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", values.title);
        formData.append("subtitle", values.subtitle);
        formData.append("minCost", values.minCost);
        formData.append("city", values.city);

        const response = await axios.post(
          "http://localhost:5000/api/addCar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMessage(response.data.message);
        formik.resetForm();
        setSelectedFile(null);
        if (onAddMarker && response.data.car) {
          onAddMarker(response.data.car.latitude, response.data.car.longitude);
        }
      } catch (error) {
        console.error("Error adding car:", error);
        setMessage("Internal Server Error");
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h4" mb={3}>
        Додай своє оголошення
      </Typography>
      <form
        onSubmit={formik.handleSubmit}
        className="form-style"
        encType="multipart/form-data"
      >
        <TextField
          id="title"
          label="Назва транспортного засобу"
          variant="outlined"
          fullWidth
          {...formik.getFieldProps("title")}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          id="subtitle"
          label="Модель"
          variant="outlined"
          fullWidth
          mt={2}
          {...formik.getFieldProps("subtitle")}
          error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
          helperText={formik.touched.subtitle && formik.errors.subtitle}
        />
        <TextField
          id="minCost"
          label="Мінімальна вартість(грн)"
          variant="outlined"
          fullWidth
          mt={2}
          {...formik.getFieldProps("minCost")}
          error={formik.touched.minCost && Boolean(formik.errors.minCost)}
          helperText={formik.touched.minCost && formik.errors.minCost}
        />
        <TextField
          id="city"
          label="Місто"
          variant="outlined"
          fullWidth
          mt={2}
          {...formik.getFieldProps("city")}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />

        <div className="container-choose-photo">
          <Typography>Завантаж фото транспорту:</Typography>
          <label htmlFor="fileInput" className="input-style">
            <input
              required
              type="file"
              id="fileInput"
              onChange={(event) => {
                formik.handleChange(event);
                handleFileChange(event);
              }}
            />
            Обери фото
          </label>
          {selectedFile && <p>Вибраний файл: {selectedFile.name}</p>}
        </div>

        <Button type="submit" variant="contained" color="primary" mt={2}>
          Add Car
        </Button>
      </form>
      {message && (
        <Typography variant="body1" color="error" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Form;

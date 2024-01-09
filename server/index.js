require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const opencage = require('opencage-api-client');
const axios = require('axios');
const path = require('path');


const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, '../test-task/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../test-task/build', 'index.html'));
});

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uri = process.env.MONGODB_URI;
const opencageApiKey = process.env.OPENCAGE_API_KEY;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const carSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  subtitle: String,
  rating: Number,
  minCost: String,
  city: String,
  latitude: Number,
  longitude: Number
});
const Car = mongoose.model('Car', carSchema);

app.get("/api", (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.get("/api/getAllCars", async (req, res) => {
  try {
    const allCars = await Car.find({});
    res.json({ cars: allCars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const addCar = async (file, body) => {
  try {
    const { title, subtitle, minCost, city } = body;

    const response = await opencage.geocode({ q: city, key: opencageApiKey, language: 'uk' });

    let latitude, longitude;

    if (response.status.code === 200 && response.results.length > 0) {
      const place = response.results[0];
      latitude = place.geometry.lat;
      longitude = place.geometry.lng;
    } else {
      console.error('Status:', response.status.message);
      console.error('total_results:', response.total_results);
      throw new Error('Unable to retrieve coordinates for the city');
    }

    const car = await Car.create({
      imageUrl: file ? `/api/uploads/${file.originalname}` : "",
      title,
      subtitle,
      minCost,
      city,
      latitude,
      longitude,
    });

    if (file && file.buffer) {
      const filePath = `./uploads/${file.originalname}`;
      await fs.promises.writeFile(filePath, file.buffer);

      car.imageUrl = `/api/uploads/${file.originalname}`;
      await car.save();
    }

    return car;
  } catch (error) {
    throw new Error(`Error adding car: ${error.message}`);
  }
};


app.post("/api/addCar", multer({ storage: storage }).single("file"), async (req, res) => {
  try {
    const file = req.file;
    const car = await addCar(file, req.body);

    res.json({ message: "Added successfully!", car });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getCoordinates", async (req, res) => {
  try {
    const car = await addCar(null, req.body);
    res.json(car);
  } catch (error) {
    console.error("Error getting coordinates:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/uploads/:imageName", (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = `./uploads/${imageName}`;

    fs.readFile(imagePath, (err, imageBuffer) => {
      if (err) {
        console.error("Error reading image file:", err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.writeHead(200, { 'Content-Type': 'image/jpg/png' });
      res.end(imageBuffer, 'binary');
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log('Server started on port 5000');
});

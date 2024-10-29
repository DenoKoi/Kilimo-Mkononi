// Import dependencies 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Make sure to install axios with `npm install axios`
const multer = require('multer');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const torch = require('torch');  // Ensure PyTorch model is properly loaded

// Import Models (Ensure these models exist in the models folder)
const Farmer = require('./models/Farmer'); 
const Home = require('./models/Home'); 
const FieldData = require('./models/FieldData'); 
const FarmManagement = require('./models/FarmManagement'); 
const PestDiseaseManagement = require('./models/PestManagement'); 

// Initialize the app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json()); 
app.use(express.static('public')); // Serve static files

// Serve home.html for the home route
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/frontend/home.html'); // Adjust this path if needed
});

// MongoDB Atlas Connection
const mongoURI = 'mongodb+srv://deniskoimet:B0RGvTmJGfsVJw8j@cluster0.jdqj4.mongodb.net/kilimomkononidb?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('Error connecting to MongoDB Atlas:', err));

// ROUTES

// Farmer Registration
app.post('/api/farmers', async (req, res) => {
  try {
    const farmerData = req.body;
    const newFarmer = new Farmer(farmerData);
    const savedFarmer = await newFarmer.save();
    res.status(201).json({ message: 'Farmer registered successfully', data: savedFarmer });
  } catch (error) {
    res.status(500).json({ message: 'Error registering farmer', error: error.message });
  }
});

// Retrieve All Farmers
app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmers', error: error.message });
  }
});

// SECTION: Home Page
// POST - Add content for the Home Page
app.post('/api/home', async (req, res) => {
  try {
    const homeData = new Home(req.body);
    const savedHomeData = await homeData.save();
    res.status(201).json({ message: 'Home data added successfully', data: savedHomeData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding home data', error: error.message });
  }
});

// GET - Retrieve Home Page content
app.get('/api/home', async (req, res) => {
  try {
    const homeData = await Home.find();
    res.status(200).json(homeData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home data', error: error.message });
  }
});

// SECTION: Field Data Input
// POST - Add new field data
app.post('/api/fieldData', async (req, res) => {
  try {
    const fieldData = new FieldData(req.body);
    const savedFieldData = await fieldData.save();
    res.status(201).json({ message: 'Field data added successfully', data: savedFieldData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding field data', error: error.message });
  }
});

// GET - Retrieve all field data
app.get('/api/fieldData', async (req, res) => {
  try {
    const fieldData = await FieldData.find();
    res.status(200).json(fieldData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching field data', error: error.message });
  }
});

// SECTION: Weather Forecast
app.get('/api/weather', async (req, res) => {
  const location = req.query.location;
  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    const weatherApiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`; // Using metric units for Celsius

    const response = await axios.get(weatherApiUrl);
    const weatherData = response.data;

    // Extract necessary data
    const formattedData = {
      location: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      wind_speed: weatherData.wind.speed,
      date: new Date().toLocaleString(), // Add the current date and time
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// SECTION: Farm Management
// POST - Add new farm management record
app.post('/api/farmManagement', async (req, res) => {
  try {
    const farmManagementData = new FarmManagement(req.body);
    const savedFarmManagementData = await farmManagementData.save();
    res.status(201).json({ message: 'Farm management data added successfully', data: savedFarmManagementData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding farm management data', error: error.message });
  }
});

// GET - Retrieve all farm management records
app.get('/api/farmManagement', async (req, res) => {
  try {
    const farmManagementData = await FarmManagement.find();
    res.status(200).json(farmManagementData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm management data', error: error.message });
  }
});

// SECTION: Pest Management
// POST - Add new pest management record
app.post('/api/pestManagement', async (req, res) => {
  try {
    const pestData = new PestManagement(req.body);
    const savedPestData = await pestData.save();
    res.status(201).json({ message: 'Pest management data added successfully', data: savedPestData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding pest management data', error: error.message });
  }
});

// GET - Retrieve all pest management records
app.get('/api/pestManagement', async (req, res) => {
  try {
    const pestData = await PestManagement.find();
    res.status(200).json(pestData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pest data', error: error.message });
  }
});

// Configure image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load PyTorch model
let model;
async function loadPestModel() {
  try {
    model = torch.jit.load('./pest_detection_model.pth'); // Replace with the actual path
    model.eval(); // Set model to evaluation mode
  } catch (error) {
    console.error('Error loading model:', error.message);
  }
}
loadPestModel();

// Image preprocessing function
async function preprocessImage(buffer) {
  const image = torch.tensor(buffer).to(torch.float32).div(255).unsqueeze(0); // Example preprocessing
  // Customize this based on your model's requirements (e.g., resize, normalize)
  return image;
}

// Pest Detection Endpoint
app.post('/api/pestDetection', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    // Process the image for model input
    const buffer = req.file.buffer;
    const image = await preprocessImage(buffer);

    // Perform pest detection using the PyTorch model
    let prediction;
    torch.no_grad(() => {
      const output = model.forward(image);
      prediction = output.argmax(1).item(); // Assuming classification with argmax
    });

    res.status(200).json({ message: 'Pest detected', pestType: prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error in pest detection', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Test endpoint to check server status
app.get('/test', (req, res) => {
  res.send('Server is working!');
});
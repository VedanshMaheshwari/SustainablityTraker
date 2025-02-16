const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const DATA_FILE = 'data.json';

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Helper function to read data from the JSON file
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write data to the JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET endpoint to fetch all actions
app.get('/api/actions', (req, res) => {
  try {
    const actions = readData();
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST endpoint to add a new action
app.post('/api/actions', (req, res) => {
  const { action, date, points } = req.body;

  // Validate the payload
  if (!action || !date || !points) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const actions = readData();

    // Generate a new ID
    const newId = actions.length > 0 ? Math.max(...actions.map(a => a.id)) + 1 : 1;

    // Create the new action object
    const newAction = {
      id: newId, // Auto-generated ID
      action,
      date,
      points,
    };

    // Add the new action to the list
    actions.push(newAction);

    // Save the updated list to the JSON file
    writeData(actions);

    // Respond with the new action
    res.status(201).json(newAction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
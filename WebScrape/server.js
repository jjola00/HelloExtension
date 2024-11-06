//server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// POST route for sending data to Notion
app.post('/sendToNotion', async (req, res) => {
  const { notionToken, databaseId, profileData } = req.body;

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          'Name': { type: 'title', title: [{ text: { content: profileData.name } }] },
          'URL': { type: 'url', url: profileData.url },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      }
    );

    res.status(200).json(response.data); // Send Notion response data back to the client
  } catch (error) {
    console.error("Error sending data to Notion:", error);
    res.status(500).json({ error: "Failed to send data to Notion" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

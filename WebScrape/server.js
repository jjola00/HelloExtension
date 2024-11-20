// server.js
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const PORT = 4000
app.use(cors())
app.use(express.json())

app.post('/clearDatabase', async (req, res) => {
  const { notionToken, databaseId } = req.body;

  const notion = axios.create({
    baseURL: 'https://api.notion.com/v1/',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  });

  try {
    // Retrieve all entries
    const response = await notion.post(`databases/${databaseId}/query`);
    const pages = response.data.results;

    // Archive each page
    for (const page of pages) {
      await notion.patch(`pages/${page.id}`, { archived: true });
    }

    console.log('Database cleared.');
    res.status(200).json({ success: true, message: 'Database cleared.' });
  } catch (error) {
    console.error('Error clearing database:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to clear database.' });
  }
});


app.post('/sendToNotion', async (req, res) => {
  const { notionToken, databaseId, profileData } = req.body

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          'Profile link': { type: 'url', url: profileData.url }
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
      }
    )
    console.log('Notion Response:', response.data)
    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error sending data to Notion:", error.response ? error.response.data : error.message)
    res.status(500).json({ error: "Failed to send data to Notion" })
  }
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

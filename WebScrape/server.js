const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.post('/sendToNotion', async (req, res) => {
  const { notionToken, databaseId, profileData } = req.body

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          'Name': { type: 'title', title: [{ text: { content: profileData.name } }] },
          'Profile link': { type: 'url', url: profileData.url },
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
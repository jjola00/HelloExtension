//clearDB.js
const axios = require('axios')
const notionToken = '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'
const databaseId = '136c9e86-87b8-8035-a8bf-f9fe34b7a2f7'

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${notionToken}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  },
})

async function getDatabaseEntries() {
  try {
    const response = await notion.post(`databases/${databaseId}/query`)
    return response.data.results
  } catch (error) {
    console.error('Error retrieving entries:', error.response ? error.response.data : error.message)
    return []
  }
}

async function deletePage(pageId) {
  try {
    await notion.patch(`pages/${pageId}`, { archived: true })
    console.log(`Deleted page with ID: ${pageId}`)
  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error.response ? error.response.data : error.message)
  }
}

async function clearDatabase() {
  const pages = await getDatabaseEntries()
  for (const page of pages) {
    await deletePage(page.id)
  }
  console.log('Database cleared.')
}
clearDatabase()

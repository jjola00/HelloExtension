chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToNotion') {
    const notionAPIKey = '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';
    const databaseId = '136c9e86-87b8-8035-a8bf-f9fe34b7a2f7';

    const profileURL = message.profileURL;

    fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionAPIKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: "LinkedIn Profile" } }]
          },
          URL: {
            url: profileURL
          }
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("URL added to Notion:", data);
      sendResponse({ success: true });
    })
    .catch(error => {
      console.error("Error sending URL to Notion:", error);
      sendResponse({ success: false, error: error.toString() });
    });

    return true;
  }
});

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendProfileToNotion') {
    const profileData = message.profileData
    const proxyURL = 'http://localhost:4000/sendToNotion'

    fetch(proxyURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notionToken: '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',
        databaseId: '136c9e86-87b8-8035-a8bf-f9fe34b7a2f7',
        profileData: profileData
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Profile URL sent to Notion:", data)
      sendResponse({ success: true, data })
    })
    .catch(error => {
      console.error("Error sending URL to Notion:", error)
      sendResponse({ success: false, error: error.toString() })
    })

    return true
  }
})

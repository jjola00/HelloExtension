//popup.js
function sendProfileURLToNotion(profileURL) {
  chrome.runtime.sendMessage({ action: 'saveToNotion', profileURL }, (response) => {
    if (response.success) {
      console.log("Profile URL sent to Notion successfully.")
    } else {
      console.error("Failed to send profile URL to Notion:", response.error)
    }
  });
}
document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.runtime.sendMessage(
        {
          action: 'sendProfileToNotion',
          profileData: { url: tabs[0].url } 
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message)
          } else if (response && response.success) {
            console.log("Profile URL successfully sent to Notion:", response.data)
          } else {
            console.error("Failed to send profile URL to Notion.")
          }
        }
      )
    } else {
      console.error("No active tab found.");
    }
  })
})

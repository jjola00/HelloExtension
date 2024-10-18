//popup.js
function scrapeAndNavigateConnections() {
  try {
    const profileLinks = document.querySelectorAll('a[href^="/in/"]')
    let connections = []
    profileLinks.forEach(link => {
      const profileURL = link.href
      const isProfileURL = /^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/?$/.test(profileURL)
      if (isProfileURL) {
        connections.push(profileURL)
      }
    })
    console.log("Filtered connections: ", connections)
    chrome.runtime.sendMessage({ action: 'navigateToProfiles', connections: connections.slice(0, 5) })
  } catch (error) {
    console.error("Error in scraping connections:", error.message)
  }
}

document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndNavigateConnections // profile hopping trigger
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message)
        } else {
          console.log("Scraping results:", injectionResults[0].result)
        }
      })
    } else {
      console.error("No active tab found.")
    }
  })
})
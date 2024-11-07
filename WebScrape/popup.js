// popup.js

// Opens LinkedIn connections page
function openConnectionsPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            const connectionsLink = document.querySelector('a[href*="facetNetwork=%22F%22"]')
            if (connectionsLink) {
              window.location.href = connectionsLink.href;
            } else {
              console.error("Connections link not found on page.")
            }
          },
        },
        () => console.log("Navigated to connections page.")
      )
    }
  })
}

// Scrapes profiles in the connections list and sends to Notion
function scrapeConnections() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            // Select all connection links on the page
            const profileLinks = Array.from(document.querySelectorAll('a.app-aware-link'))
              .map((link) => link.href)
              .filter((href) => href.includes("linkedin.com/in/")); // Ensure valid profile URLs
            return profileLinks;
          },
        },
        (results) => {
          let profileUrls = results[0].result
          profileUrls = profileUrls.slice(0, 10)

          if (profileUrls.length > 0) {
            // Send each profile URL to Notion
            profileUrls.forEach((profileURL) => {
              chrome.runtime.sendMessage({ action: 'sendProfileToNotion', profileData: { url: profileURL } })
            })
          } else {
            console.error("No profile URLs found.")
          }
        }
      )
    }
  })
}
document.getElementById('openConnectionsButton').addEventListener('click', openConnectionsPage)
document.getElementById('scrapeButton').addEventListener('click', scrapeConnections)

// popup.js
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

function scrapeConnections() {
  const titleRegex = "head"
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: (regex) => {
            const titles = Array.from(document.querySelectorAll('.entity-result__primary-subtitle'))
              .map((element) => element.innerText.trim().toLowerCase())
            const filteredTitles = titles.filter((title) => title.includes(regex.toLowerCase()))
            console.log("All Titles: ", titles)
            console.log("Regex: ", regex)
            console.log("Filtered Titles: ", filteredTitles)

            const profileLinks = Array.from(document.querySelectorAll('a.app-aware-link'))
              .map((link) => link.href)
              .filter((href) => href.includes("linkedin.com/in/"))
            return { profileLinks, filteredTitles }
          },
          args: [titleRegex],
        },
        (results) => {
          let profileUrls = results[0].result.profileLinks
          profileUrls = profileUrls.slice(0, 2) // Limit to first 2 profiles for testing

          if (profileUrls.length > 0) {
            // Send each profile URL to Notion
            profileUrls.forEach((profileURL) => {
              chrome.runtime.sendMessage({ action: 'sendProfileToNotion', profileData: { url: profileURL } })
            })
          } else {
            console.error("No profile URLs found.")
          }
        }
      );
    }
  });
}

document.getElementById('openConnectionsButton').addEventListener('click', openConnectionsPage)
document.getElementById('scrapeButton').addEventListener('click', scrapeConnections)

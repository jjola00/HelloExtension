function scrapeAndNavigateConnections() {
  try {
    // Look for the connections link with the specific pattern
    const connectionsLink = document.querySelector('a[href*="search/results/people/?connectionOf"]');

    if (connectionsLink) {
      const connectionsURL = "https://www.linkedin.com" + connectionsLink.getAttribute('href');
      console.log("Connections URL found: ", connectionsURL);

      // Send the connections URL for navigation
      chrome.runtime.sendMessage({ action: 'navigateToProfiles', connections: [connectionsURL] });
    } else {
      console.error("Connections link not found.");
    }
  } catch (error) {
    console.error("Error in scraping connections link:", error.message);
  }
}

document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndNavigateConnections // Now looking for connections link
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Scraping results:", injectionResults[0]?.result);
        }
      });
    } else {
      console.error("No active tab found.");
    }
  });
});

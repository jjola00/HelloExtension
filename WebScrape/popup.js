document.getElementById('scrapeButton').addEventListener('click', () => {
    console.log("scrapeButton clicked");
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        console.log("tabId", tabId);
  
        // Inject and execute script in the active tab to scrape text
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: scrapeAndSendText
        });
      } else {
        console.error("No active tab found.");
      }
    });
  });
  
  //function is injected into the tab and scrapes the text
  function scrapeAndSendText() {
    const textContent = document.body.innerText;
    console.log("textContent", textContent);
  
    // Send the scraped text to the background script to save it
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedText: textContent });
  }
  
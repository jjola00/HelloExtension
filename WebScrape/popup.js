function scrapeAndSendText() {
  try {
    const textContent = document.body.innerText;
    
    // sends scraped text to background script
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedText: textContent });

    return {
      message: "Scraping completed",
      textLength: textContent.length,
      firstFewChars: textContent.substring(0, 50)
    };
  } catch (error) {
    return { error: error.message };
  }
}

document.getElementById('scrapeButton').addEventListener('click', () => {
  //gets active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndSendText
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Scraping results:", injectionResults[0].result);
        }
      });
    } else {
      console.error("No active tab found.");
    }
  });
});
document.getElementById('scrapeButton').addEventListener('click', async () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            
            // Inject and execute script in the active tab
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: scrapeAndSendText
            });
        } else {
            console.error("No active tab found.");
        }
    });
});

// This function is injected into the tab and scrapes the text
function scrapeAndSendText() {
    const textContent = document.body.innerText;

    // Send the scraped text to the background script to save it to Google Sheets
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedText: textContent });
}
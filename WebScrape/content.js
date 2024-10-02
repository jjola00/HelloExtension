chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scrapeText') {
        // Scrape all the text from the page
        const textContent = document.body.innerText;

        // Send the scraped text back to the background script to save it to Google Sheets
        chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedText: textContent });
    }
});
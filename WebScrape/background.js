// Listener for messages sent from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scrapePage') {
        // sends message to the content script to start scraping text
        chrome.tabs.sendMessage(sender.tab.id, { action: 'scrapeText' });
    }

    if (message.action === 'saveToGoogleSheets') {
        const { scrapedText } = message;

        // sends data to Google Sheets
        fetch(backendURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: scrapedText }),
        })
        .then(response => response.json())
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);  // Log success
            sendResponse({ success: true, data });  // Always call sendResponse here
        })
        .catch(error => {
            console.error('Error:', error);  // Log error
            sendResponse({ success: false, error });  // Always call sendResponse here, too
        });

        //indicate that we'll respond asynchronously
        return true;
    }
});

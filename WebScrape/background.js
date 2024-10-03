chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToGoogleSheets') {
    const backendURL = 'https://script.google.com/macros/s/AKfycby30T1Cw79TDIoNCHM_ZZfmeXaC2y_iVDWvtUMtHXT0JGQLECITsIbVTQPf8Jelly4j/exec';

    // Send the scraped text to Google Sheets via the backend URL
    fetch(backendURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.scrapedText }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(error => sendResponse({ success: false, error: error.toString() }));

    // Indicate that we'll respond asynchronously
    return true;
  }
});

console.log("Background script loaded");
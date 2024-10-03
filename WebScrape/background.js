chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveToGoogleSheets') {
      const { scrapedText } = message;
  
      const backendURL = 'https://script.google.com/macros/s/AKfycbxe8dPU_AGKaW9jol8gDQT-nY-JG0DOClPIkiT6TU4oLpw5SsXHgiuenCukGQxX1sXj/exec'; 
  
      // Send the scraped text to Google Sheets via the backend URL
      fetch(backendURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scrapedText }),
      })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error }));
  
      // Indicate that we'll respond asynchronously
      return true;
    }
  });
  
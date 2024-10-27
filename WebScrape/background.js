chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToGoogleSheets') {
    const backendURL = 'https://script.google.com/macros/s/AKfycbwSJL_Pk20UXtE7TJdGqS03MxNRMEswdcNCtkWB2_DoJNjOZjGSp3v3wsZBDLX3XHY/exec';

    const payload = {
      name: message.scrapedData.name || 'N/A',
      title: message.scrapedData.title || 'N/A',
      company: message.scrapedData.company || 'N/A',
      college: message.scrapedData.college || 'N/A',
      linkedinURL: message.scrapedData.linkedinURL || 'N/A',
      experiences: message.scrapedData.experiences || [],
    };

    fetch(backendURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response from Google Sheets:", data);
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error("Error sending data to Google Sheets:", error);
      sendResponse({ success: false, error: error.toString() });
    });

    return true;
  }
});

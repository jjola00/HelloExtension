chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToGoogleSheets') {
    const backendURL = 'https://script.google.com/macros/s/AKfycby-jOqsaz0FEud9CCHAizzXB6iTHg5V5fzkBAUxi3h8Kz5ho_rOQNp72o1G3XeZ9tKS/exec';

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

    return true; // Keeps the messaging channel open for asynchronous response
  }
});

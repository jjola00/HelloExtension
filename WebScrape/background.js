chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigateToProfiles') {
    const profilesToScrape = message.connections;

    profilesToScrape.forEach((profileURL, index) => {
      setTimeout(() => {
        chrome.tabs.update(sender.tab.id, { url: profileURL }, () => {
          console.log('Navigated to: ' + profileURL);

          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId: sender.tab.id },
              files: ['popup.js'] // Inject popup.js, which contains scrapeAndSendText
            }, () => {
              chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                function: scrapeAndSendText // Now we can call scrapeAndSendText
              });
            });
          }, 3000); // Adjust delay for page load time
        });
      }, index * 10000); // Stagger profile visits by 10 seconds
    });

    sendResponse({ success: true });
    return true; // Keeps the message channel open for async response
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToGoogleSheets') {
    const backendURL = 'https://script.google.com/macros/s/AKfycby30T1Cw79TDIoNCHM_ZZfmeXaC2y_iVDWvtUMtHXT0JGQLECITsIbVTQPf8Jelly4j/exec';

    const payload = {
      name: message.scrapedData.name || 'N/A',
      title: message.scrapedData.title || 'N/A',
      company: message.scrapedData.company || 'N/A',
      college: message.scrapedData.college || 'N/A',
      linkedinURL: message.scrapedData.linkedinURL || 'N/A',
      experiences: message.scrapedData.experiences || []
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

    return true; // Ensures asynchronous handling
  }
});

console.log("Background script loaded");

function scrapeAndSendText() {
  try {
    const name = document.querySelector('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words')?.innerText || 'N/A';
    const title = document.querySelector('.text-body-medium.break-words')?.innerText || 'N/A';
    const companyElement = document.querySelector('button[aria-label^="Current company:"] span.text-body-small.t-black');
    const company = companyElement ? companyElement.innerText : 'N/A';
    const collegeSection = document.querySelector('#education')?.closest('section');
    const college = collegeSection ? collegeSection.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]')?.innerText || 'N/A' : 'N/A';
    const linkedinURL = window.location.href || 'N/A';
    const experienceSection = document.querySelector('#experience')?.closest('section');
    const experienceItems = experienceSection ? experienceSection.querySelectorAll('li.artdeco-list__item') : [];
    
    let experiences = [];
    experienceItems.forEach((item) => {
      const position = item.querySelector('.t-bold span[aria-hidden="true"]')?.innerText || 'N/A';
      const company = item.querySelector('.t-14 span[aria-hidden="true"]')?.innerText || 'N/A';
      const duration = item.querySelector('.t-black--light span[aria-hidden="true"]')?.innerText || 'N/A';
      if (position !== 'N/A' || company !== 'N/A') {
        experiences.push({ position, company, duration });
      }
    });

    const scrapedData = {
      name,
      title,
      company,
      college,
      linkedinURL,
      experiences,
    };

    console.log('Scraped data:', scrapedData);
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedData });
    return {
      message: 'Scraping successful',
      data: scrapedData
    };
  } catch (error) {
    console.error('Scraping error:', error.message);
    return { error: error.message };
  }
}

console.log("Background script loaded");chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigateToProfiles') {
    const profilesToScrape = message.connections;

    profilesToScrape.forEach((profileURL, index) => {
      setTimeout(() => {
        chrome.tabs.update(sender.tab.id, { url: profileURL }, () => {
          console.log('Navigated to: ' + profileURL);

          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId: sender.tab.id },
              function: scrapeAndSendText // Injecting scrapeAndSendText directly
            }, (result) => {
              if (chrome.runtime.lastError) {
                console.error("Script injection failed:", chrome.runtime.lastError.message);
              } else {
                console.log('Scraping result:', result);
              }
            });
          }, 3000); // Delay to ensure the page is fully loaded
        });
      }, index * 10000); // Stagger profile visits by 10 seconds
    });

    sendResponse({ success: true });
    return true; 
  }
});

// Save to Google Sheets logic (unchanged)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToGoogleSheets') {
    const backendURL = 'https://script.google.com/macros/s/AKfycbwRJgejti-nOu16fFt_cz8gmwVu3XRDZnKdP1g8xQkTZjHCq_9814QxK2WM9s_oo0kY/exec';

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

    return true; 
  }
});

console.log("Background script loaded");
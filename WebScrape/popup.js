// Function to scrape and send profile data
function scrapeAndSendProfile() {
  try {
    const name = document.querySelector('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words')?.innerText || 'N/A';
    const title = document.querySelector('.text-body-medium.break-words')?.innerText || 'N/A';
    const companyElement = document.querySelector('button[aria-label^="Current company:"] span.text-body-small.t-black');
    const company = companyElement ? companyElement.innerText : 'N/A';
    const college = document.querySelector('#education').closest('section');
    const linkedinURL = window.location.href || 'N/A';

    const experienceSection = document.querySelector('#experience').closest('section'); 
    const experienceItems = experienceSection ? experienceSection.querySelectorAll('li.artdeco-list__item') : [];

    let experiences = [];
    
    // Loop to get each entry
    experienceItems.forEach((item) => {
      const position = item.querySelector('.t-bold span[aria-hidden="true"]')?.innerText || 'N/A';
      const company = item.querySelector('.t-14 span[aria-hidden="true"]')?.innerText || 'N/A';
      const duration = item.querySelector('.t-black--light span[aria-hidden="true"]')?.innerText || 'N/A';

      if (position !== 'N/A' || company !== 'N/A') {
        experiences.push({ position, company, duration });
      }
    });

    const scrapedData = { name, title, company, college, linkedinURL, experiences };

    console.log('Scraped data:', scrapedData);
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedData });
    return { message: 'Scraping successful', data: scrapedData };
  } catch (error) {
    return { error: error.message };
  }
}

function scrapeAndNavigateConnections() {
  try {
    const connectionsLink = document.querySelector('a[href*="search/results/people/?connectionOf"]');

    if (connectionsLink) {
      const connectionsURL = "https://www.linkedin.com" + connectionsLink.getAttribute('href');
      console.log("Connections URL found: ", connectionsURL);

      // Send the connections URL for navigation
      chrome.runtime.sendMessage({ action: 'navigateToProfiles', connections: [connectionsURL] });
    } else {
      console.error("Connections link not found.");
    }
  } catch (error) {
    console.error("Error in scraping connections link:", error.message);
  }
}

document.getElementById('openConnectionsButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndNavigateConnections
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Scraping results:", injectionResults[0]?.result);
        }
      });
    } else {
      console.error("No active tab found.");
    }
  });
});

document.getElementById('scrapeProfileButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndSendProfile
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Scraping results:", injectionResults[0]?.result);
        }
      });
    } else {
      console.error("No active tab found.");
    }
  });
});

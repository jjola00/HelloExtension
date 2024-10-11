function scrapeAndSendText() {
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
    
    //loop to get each entry
    experienceItems.forEach((item) => {
      const position = item.querySelector('.t-bold span[aria-hidden="true"]')?.innerText || 'N/A';
      const company = item.querySelector('.t-14 span[aria-hidden="true"]')?.innerText || 'N/A';
      const duration = item.querySelector('.t-black--light span[aria-hidden="true"]')?.innerText || 'N/A';

      if (position !== 'N/A' || company !== 'N/A') { // only add if position and company are not N/A
        experiences.push({
          position,
          company,
          duration
        });
      }
    });

    const scrapedData = {
      name,
      title,
      company,
      college,
      linkedinURL,
      experiences
    };

    console.log('Scraped data:', scrapedData);
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedData });
    return {
      message: 'Scraping successful',
      data: scrapedData
    };
  } catch (error) {
    return { error: error.message };
  }
}

document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndSendText
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Scraping results:", injectionResults[0].result);
        }
      });
    } else {
      console.error("No active tab found.");
    }
  });
});

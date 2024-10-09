function scrapeAndSendText() {
  try {
    const name = document.querySelector('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words')?.innerText || 'N/A';
    const title = document.querySelector('.text-body-medium.break-words')?.innerText || 'N/A';
    const companyElement = document.querySelector('button[aria-label^="Current company:"] span.text-body-small.t-black');
    const company = companyElement ? companyElement.innerText : 'N/A';
    const college = document.querySelector('.artdeco-list-item .optional-action-target-wrapper span[aria-hidden="true"]')?.innerText || 'N/A';
    const linkedinURL = window.location.href || 'N/A'; 

    console.log("This is the scraped data:", { name, title, company, college, linkedinURL });

    const scrapedData = {
      name,  
      title,  
      company,
      college,
      linkedinURL
    };

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

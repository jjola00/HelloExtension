//popup.js
function scrapeAndSendText() {
  try {
    const name = document.querySelector('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words')?.innerText || 'N/A'
    const title = document.querySelector('.text-body-medium.break-words')?.innerText || 'N/A'
    const companyElement = document.querySelector('button[aria-label^="Current company:"] span.text-body-small.t-black')
    const company = companyElement ? companyElement.innerText : 'N/A'
    const collegeSection = document.querySelector('#education').closest('section')
    const college = collegeSection.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]')?.innerText || 'N/A'
    const linkedinURL = window.location.href || 'N/A'
    const experienceSection = document.querySelector('#experience').closest('section')
    const experienceItems = experienceSection ? experienceSection.querySelectorAll('li.artdeco-list__item') : []
    let experiences = []
    experienceItems.forEach((item) => {
      const position = item.querySelector('.t-bold span[aria-hidden="true"]')?.innerText || 'N/A'
      const company = item.querySelector('.t-14 span[aria-hidden="true"]')?.innerText || 'N/A'
      const duration = item.querySelector('.t-black--light span[aria-hidden="true"]')?.innerText || 'N/A'
      if (position !== 'N/A' || company !== 'N/A') {
        experiences.push({ position, company, duration })
      }
    })
    const scrapedData = {
      name,
      title,
      company,
      college,
      linkedinURL,
      experiences,
    }
    console.log('Scraped data:', scrapedData)
    chrome.runtime.sendMessage({ action: 'saveToGoogleSheets', scrapedData })
    return {
      message: 'Scraping successful',
      data: scrapedData
    }
  } catch (error) {
    return { error: error.message }
  }
}

function scrapeAndNavigateConnections() {
  try {
    const profileLinks = document.querySelectorAll('a[href^="/in/"]')
    let connections = []
    profileLinks.forEach(link => {
      const profileURL = link.href
      const isProfileURL = /^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/?$/.test(profileURL)
      if (isProfileURL) {
        connections.push(profileURL)
      }
    })
    console.log("Filtered connections: ", connections)
    chrome.runtime.sendMessage({ action: 'navigateToProfiles', connections: connections.slice(0, 5) })
  } catch (error) {
    console.error("Error in scraping connections:", error.message)
  }
}

document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeAndNavigateConnections // profile hopping trigger
      }, (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError.message)
        } else {
          console.log("Scraping results:", injectionResults[0].result)
        }
      })
    } else {
      console.error("No active tab found.")
    }
  })
})
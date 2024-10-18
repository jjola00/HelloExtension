// Background Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigateToProfiles') {
    const profilesToScrape = message.connections

    profilesToScrape.forEach((profileURL, index) => {
      setTimeout(() => {
        chrome.tabs.update(sender.tab.id, { url: profileURL }, () => {
          console.log('Navigated to: ' + profileURL)
          
          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId: sender.tab.id },
              function: scrapeAndSendText
            })
          }, 3000)
        })
      }, index * 10000)
    })

    sendResponse({ success: true })
    return true
  }
})
document.getElementById('scrapeButton').addEventListener('click', async () => {
    //gets the active tab in the current window
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    //inject script into the active tab to scrape the text
    chrome.runtime.sendMessage({ action: 'scrapePage' });
});

// You can remove this function if not used anymore
function scrapeAndSendText() {
    let textContent = document.body.innerText;

    // sends the scraped text to the backend
    fetch(backendURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent })
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}
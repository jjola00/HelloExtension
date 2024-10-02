let textContent = document.body.innerText;

function sendDataToGoogleSheet(text) {
    // Send a POST request to the backend URL
    fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data sent to Google Sheet:', data);
    })
    .catch(error => {
        console.error('Error sending data to Google Sheet:', error);
    });
}

// Call the function to send the scraped text to the Google Sheet
sendDataToGoogleSheet(textContent);
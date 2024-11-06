function sendProfileURLToNotion(profileURL) {
  chrome.runtime.sendMessage({ action: 'saveToNotion', profileURL }, (response) => {
    if (response.success) {
      console.log("Profile URL sent to Notion successfully.");
    } else {
      console.error("Failed to send profile URL to Notion:", response.error);
    }
  });
}
document.getElementById('sendButton').addEventListener('click', () => {
  const profileURL = window.location.href;
  sendProfileURLToNotion(profileURL);
});

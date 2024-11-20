// popup.js

// Function to navigate to the Connections page
function openConnectionsPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            const connectionsLink = document.querySelector('a[href*="facetNetwork=%22F%22"]');
            if (connectionsLink) {
              window.location.href = connectionsLink.href;
            } else {
              console.error("Connections link not found on page.");
            }
          },
        },
        () => console.log("Navigated to connections page.")
      );
    }
  });
}

// Function to scrape LinkedIn profiles
function scrapeConnections() {
  const titleRegex = "head";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: (regex) => {
            const titles = Array.from(document.querySelectorAll('.entity-result__primary-subtitle'))
              .map((element) => element.innerText.trim().toLowerCase());
            const filteredTitles = titles.filter((title) => title.includes(regex.toLowerCase()));
            console.log("All Titles: ", titles);
            console.log("Regex: ", regex);
            console.log("Filtered Titles: ", filteredTitles);

            const profileLinks = Array.from(document.querySelectorAll('a[href*="/in/"]'))
              .map((link) => link.href)
              .filter((href) => href.includes("linkedin.com/in/"));
            return { profileLinks, filteredTitles };
          },
          args: [titleRegex],
        },
        (results) => {
          let profileUrls = results[0].result.profileLinks;
          profileUrls = profileUrls.slice(0, 2); // Limit to first 2 profiles for testing

          if (profileUrls.length > 0) {
            // Send each profile URL to Notion
            profileUrls.forEach((profileURL) => {
              chrome.runtime.sendMessage({ action: 'sendProfileToNotion', profileData: { url: profileURL } });
            });
          } else {
            console.error("No profile URLs found.");
          }
        }
      );
    }
  });
}

// Function to delete all database entries
async function clearDatabase() {
  const confirmation = confirm('Are you sure you want to delete all entries?');
  if (!confirmation) return;

  const proxyURL = 'http://localhost:4000/clearDatabase';
  const notionToken = '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';
  const databaseId = '136c9e86-87b8-8035-a8bf-f9fe34b7a2f7';

  try {
    const response = await fetch(proxyURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notionToken, databaseId }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message || 'Database cleared successfully.');
    } else {
      const errorData = await response.json();
      alert(`Failed to clear database: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    alert('An error occurred while clearing the database.');
  }
}

// Attach event listeners to buttons
document.getElementById('openConnectionsButton').addEventListener('click', openConnectionsPage);
document.getElementById('scrapeButton').addEventListener('click', scrapeConnections);
document.getElementById('deleteAll').addEventListener('click', clearDatabase);

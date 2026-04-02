// Replace the URL below with your "Published to Web" CSV link
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTx-zAxrhc8vorsLIA0fWwQPWpLf0aK11E7GBjKpLCwpwaDmb1YU3d6gKcPNVxgtQC1ZS62dhZp2LD-/pub?gid=0&single=true&output=csv";

async function fetchQuotes() {
    try {
        // Adding a timestamp prevents GitHub from caching an old version of your sheet
        const response = await fetch(`${sheetURL}&t=${new Date().getTime()}`);
        const data = await response.text();
        
        // Split by lines and filter out empty ones
        const rows = data.split('\n').filter(row => row.trim() !== '');
        
        // Remove the header row (Column A, Column B)
        rows.shift();

        if (rows.length > 0) {
            displayRandomQuote(rows);
        } else {
            document.getElementById('quote').innerText = "No quotes found in sheet!";
        }
    } catch (error) {
        console.error("Error fetching quotes:", error);
        document.getElementById('quote').innerText = "Connection error. Check your CSV link!";
    }
}

function displayRandomQuote(rows) {
    const randomIndex = Math.floor(Math.random() * rows.length);
    const randomRow = rows[randomIndex];

    // This regex splits the CSV correctly even if there are commas inside the quotes
    const parts = randomRow.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    
    if (parts && parts.length >= 1) {
        let quoteText = parts[0].replace(/^"|"$/g, '').replace(/""/g, '"');
        let authorText = parts[1] ? parts[1].replace(/^"|"$/g, '').replace(/""/g, '"') : "Unknown";

        // Convert the "Alt+Enter" line breaks from Google Sheets into HTML breaks
        document.getElementById('quote').innerHTML = quoteText.replace(/\n/g, '<br>');
        document.getElementById('author').innerText = authorText;
    }
}

fetchQuotes();

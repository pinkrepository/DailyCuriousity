// Replace the URL below with your "Published to Web" CSV link
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTx-zAxrhc8vorsLIA0fWwQPWpLf0aK11E7GBjKpLCwpwaDmb1YU3d6gKcPNVxgtQC1ZS62dhZp2LD-/pub?gid=0&single=true&output=csv";

async function fetchQuotes() {
    try {
        const response = await fetch(`${sheetURL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        
        // Use a robust parser for multi-line CSV cells
        const rows = parseCSV(csvText);
        
        // Remove the header row
        rows.shift();

        // Filter out any completely empty rows
        const cleanRows = rows.filter(row => row[0] && row[0].trim() !== '');

        if (cleanRows.length > 0) {
            displayRandomQuote(cleanRows);
        } else {
            document.getElementById('quote').innerText = "No quotes found!";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('quote').innerText = "Connection error!";
    }
}

// A professional-grade CSV parser that handles multi-line cells correctly
function parseCSV(text) {
    const p = /"([^"]*(?:""[^"]*)*)"|([^,\r\n]+)|(?<=^|,)(?=[,\r\n]|$)/g;
    const rows = [[]];
    let m;
    let lastIndex = 0;

    while (m = p.exec(text)) {
        if (text.substring(lastIndex, m.index).includes('\n') && rows[rows.length-1].length > 0) {
            rows.push([]);
        }
        let v = m[1] !== undefined ? m[1].replace(/""/g, '"') : (m[2] !== undefined ? m[2] : "");
        rows[rows.length - 1].push(v);
        lastIndex = p.lastIndex;
    }
    return rows;
}

function displayRandomQuote(rows) {
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    
    // Column A is the Quote, Column B is the Author
    let quoteText = randomRow[0] || "No Quote";
    let authorText = randomRow[1] || "Unknown";

    // This converts the line breaks inside the cell into HTML breaks for the screen
    document.getElementById('quote').innerHTML = quoteText.replace(/\n/g, '<br>');
    document.getElementById('author').innerText = authorText;
}

fetchQuotes();

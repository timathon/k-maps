const fs = require('fs');
const path = require('path');

const foldersToScan = ['english', 'math'];
const outputFile = 'index.html';

/**
 * Recursively scans a directory for HTML files.
 * @param {string} dir 
 * @returns {Array} 
 */
function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const result = [];

    // Sort entries: directories first, then files
    const sortedEntries = entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    for (const entry of sortedEntries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const children = scan(fullPath);
            if (children.length > 0) {
                result.push({ name: entry.name, type: 'dir', children });
            }
        } else if (entry.name.endsWith('.html') && entry.name !== outputFile) {
            result.push({ name: entry.name, type: 'file', path: fullPath });
        }
    }
    return result;
}

/**
 * Generates nested HTML lists from the scanned tree structure.
 * @param {Array} tree 
 * @returns {string}
 */
function generateHTMLList(tree) {
    if (tree.length === 0) return '';
    let html = '<ul>';
    for (const item of tree) {
        if (item.type === 'dir') {
            html += `<li><strong>${item.name}</strong>${generateHTMLList(item.children)}</li>`;
        } else {
            html += `<li><a href="${item.path}">${item.name}</a></li>`;
        }
    }
    html += '</ul>';
    return html;
}

const tree = foldersToScan.map(folder => {
    const folderPath = path.join(process.cwd(), folder);
    if (fs.existsSync(folderPath)) {
        return { name: folder, type: 'dir', children: scan(folder) };
    }
    return null;
}).filter(Boolean);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Maps Content Index</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f4f4f9;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.5rem;
        }
        ul {
            list-style-type: none;
            padding-left: 1.5rem;
        }
        li {
            margin-bottom: 0.5rem;
        }
        strong {
            display: block;
            margin-top: 1rem;
            color: #2980b9;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.05rem;
        }
        a {
            color: #34495e;
            text-decoration: none;
            transition: color 0.2s;
        }
        a:hover {
            color: #3498db;
            text-decoration: underline;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>K-Maps Content Index</h1>
        ${generateHTMLList(tree)}
    </div>
</body>
</html>`;

fs.writeFileSync(outputFile, htmlContent);
console.log(`Successfully generated ${outputFile}`);

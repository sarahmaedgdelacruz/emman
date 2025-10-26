const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 7890;

// Utility: handle internal errors
function sendInternalError(res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Internal Server Error');
}

// Utility: serve files safely
function serveFile(res, filePath, contentType, statusCode = 200) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFound = path.join(__dirname, 'views', '404.html');
      if (fs.existsSync(notFound)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        fs.createReadStream(notFound).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    res.writeHead(statusCode, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => sendInternalError(res));
    stream.pipe(res);
  });
}

// Detect content type by file extension
function getContentTypeByExt(ext) {
  switch (ext.toLowerCase()) {
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.html': return 'text/html';
    default: return 'application/octet-stream';
  }
}

// Server logic
const server = http.createServer((req, res) => {
  const rawUrl = req.url || '/';
  const pathname = rawUrl.split('?')[0];
  console.log(`➡ Request: ${pathname}`);

  // ROUTES for your main HTML pages
  if (pathname === '/' || pathname === '/welcome' || pathname === '/welcome.html') {
    serveFile(res, path.join(__dirname, 'views', 'welcome.html'), 'text/html');
    return;
  }

  if (pathname === '/music' || pathname === '/music.html') {
    serveFile(res, path.join(__dirname, 'views', 'music.html'), 'text/html');
    return;
  }

  if (pathname === '/movie' || pathname === '/movie.html') {
    serveFile(res, path.join(__dirname, 'views', 'movie.html'), 'text/html');
    return;
  }

  if (pathname === '/food' || pathname === '/food.html') {
    serveFile(res, path.join(__dirname, 'views', 'food.html'), 'text/html');
    return;
  }

  // Serve your static assets (CSS, images)
  if (pathname === '/stylesheets/style.css' || pathname === '/style.css') {
    serveFile(res, path.join(__dirname, 'stylesheets', 'style.css'), 'text/css');
    return;
  }

  if (pathname.startsWith('/images/')) {
    const imgPath = path.join(__dirname, pathname);
    const ext = path.extname(imgPath) || '.jpg';
    const contentType = getContentTypeByExt(ext);
    serveFile(res, imgPath, contentType);
    return;
  }

  // Default 404
  serveFile(res, path.join(__dirname, 'views', '404.html'), 'text/html', 404);
});

// ✅ This works on Render (and localhost)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

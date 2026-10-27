
const http = require('http');

const PORT = 4000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');

    console.log('\n[CAPTURE SERVER]');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${url.pathname}`);
    console.log(`Token: ${url.searchParams.get('token')}`);

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
    });

    res.end('Simulated click received.');
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Capture server running on http://127.0.0.1:${PORT}`);
});


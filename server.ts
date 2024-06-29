import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config();

let dev = process.env.NODE_ENV !== 'production';
let app = next({ dev });
let handle = app.getRequestHandler();
let port = process.env.PORT || 3000;

app.prepare().then(() => {
    let server = express();

    server.all('*', (req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    server.get('/api/hello', (req, res) => {
        res.json({ message: 'Hello from the server!' });
    });

    createServer(server).listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
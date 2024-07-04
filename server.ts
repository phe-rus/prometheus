import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FileInfo {
    name: string;
    isDirectory: boolean;
    isFile: boolean;
    path: string;
    size: number;
    numItems: number;
    uri: string | null;
    children: FileInfo[] | null;
}

app.prepare().then(() => {
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // Serve static files from the '~storage' directory
    const storagePath = path.join(__dirname, '~storage');
    server.use('/files', express.static(storagePath));

    server.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });

    server.get('/api/prometheus/files', async (req, res) => {
        try {
            const directoryPath = path.resolve(storagePath);

            const getDirectoryContents = async (dirPath: string): Promise<FileInfo[]> => {
                const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
                const filesAndFolders = await Promise.all(files.map(async (file) => {
                    const filePath = path.join(dirPath, file.name);
                    const stats = await fs.promises.stat(filePath);
                    let children: FileInfo[] = [];
                    if (file.isDirectory()) {
                        children = await getDirectoryContents(filePath);
                    }
                    const relativePath = path.relative(storagePath, filePath).replace(/\\/g, '/');
                    console.log(`File: ${file.name}, Relative Path: ${relativePath}`);
                    return {
                        name: file.name,
                        isDirectory: file.isDirectory(),
                        isFile: file.isFile(),
                        path: filePath,
                        size: stats.size,
                        numItems: children.length,
                        uri: file.isFile() ? `http://localhost:${port}/files/${relativePath}` : null,
                        children: file.isDirectory() ? children : null
                    };
                }));
                return filesAndFolders;
            };

            const directoryContents = await getDirectoryContents(directoryPath);
            res.status(200).json({ contents: directoryContents });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });

    server.all('*', (req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    createServer(server).listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
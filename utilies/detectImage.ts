// utils/detectImage.ts

import getFileIcon from "./getFileIcon";

const imageExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'svg',
    'ico', 'jfif', 'pjpeg', 'pjp', 'avif', 'apng', 'heif', 'heic'
];

const detectImage = (relativePath: string, port: any): string => {
    const extension = relativePath.split('.').pop()?.toLowerCase();

    if (imageExtensions.includes(extension || '')) {
        return `http://localhost:${port}/files/${relativePath}`;
    } else {
        return `http://localhost:${port}${getFileIcon(relativePath)}`
    }
};

export default detectImage;

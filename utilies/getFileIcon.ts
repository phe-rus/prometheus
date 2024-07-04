// utils/getFileIcon.ts
const getFileIcon = (filename: string): string => {
    const extension = filename.split('.').toString();
    const iconBasePath = '/@base-icons';
    if (filename.includes('env')) {
        return `${iconBasePath}/env.png`;
    } else {
        switch (extension) {
            case 'json':
            case 'ts':
            case 'js':
            case 'mjs':
            case 'md':
            case 'kt':
            case 'env':
            case 'kts':
            case 'git':
            case 'rar':
            case 'html':
                return `${iconBasePath}/${extension}.png`;
            default:
                return `${iconBasePath}/default.png`;
        }
    }
};

// Export the function as default export
export default getFileIcon;

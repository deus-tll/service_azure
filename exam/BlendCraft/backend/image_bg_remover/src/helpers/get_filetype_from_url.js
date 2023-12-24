import path from "path";

const getFiletypeFromUrl = (url) => {
  const fileExtension = path.extname(url);

  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp'
  };

  return mimeTypes[fileExtension.toLowerCase()] || 'application/octet-stream';
};

export default getFiletypeFromUrl;
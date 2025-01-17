const fs = require("fs");
const path = require("path");

const ensureDownloadsDir = () => {
  const downloadsDir = path.join(__dirname, "../downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  return downloadsDir;
};

const cleanupDownloads = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error cleaning up file ${filePath}:`, error);
  }
};

module.exports = { ensureDownloadsDir, cleanupDownloads };

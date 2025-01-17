const { exec } = require("child_process");

const downloadFromYouTube = (youtubeUrl, outputPath, title) => {
  return new Promise((resolve, reject) => {
    // Sanitize title for filename
    const sanitizedTitle = title.replace(/[/\\?%*:|"<>]/g, "-");
    const outputTemplate = `${outputPath}/${sanitizedTitle}.%(ext)s`;

    console.log("Download path:", outputPath);
    console.log("Output template:", outputTemplate);

    const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --embed-thumbnail --add-metadata --prefer-ffmpeg --output "${outputTemplate}" ${youtubeUrl}`;
    console.log("Executing command:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Download Error:", error.message);
        console.error("stderr:", stderr);
        return reject(new Error(`Download failed: ${stderr || error.message}`));
      }

      console.log("Download completed successfully");
      console.log("stdout:", stdout);
      resolve(stdout || stderr);
    });
  });
};

module.exports = { downloadFromYouTube };

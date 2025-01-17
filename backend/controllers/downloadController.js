const { searchYouTube } = require("../utils/ytSearch");
const { spawn } = require("child_process");

const downloadTrack = async (req, res) => {
  const { title, artist, spotifyId } = req.body;

  console.log(`Starting download process for: ${title} by ${artist}`);
  console.log(`SpotifyID: ${spotifyId}`);

  try {
    // Search YouTube with enhanced query
    const searchQuery = `${title} ${artist} official audio`;
    console.log(`Searching YouTube for: "${searchQuery}"`);
    const videoUrl = await searchYouTube(searchQuery);

    if (!videoUrl) {
      console.log("No matching video found on YouTube");
      return res.status(404).json({
        message: "Could not find a matching video for download",
      });
    }
    console.log(`Found matching video: ${videoUrl}`);

    // Set response headers
    const sanitizedTitle = `${title} - ${artist}`.replace(
      /[/\\?%*:|"<>]/g,
      "-"
    );
    const filename = `${sanitizedTitle}.mp3`;

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    );

    // Stream directly from yt-dlp to response
    const ytdlp = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--prefer-ffmpeg",
      "-o",
      "-", // Output to stdout
      videoUrl,
    ]);

    // Pipe the output directly to response
    ytdlp.stdout.pipe(res);

    // Handle errors
    ytdlp.stderr.on("data", (data) => {
      console.error(`yt-dlp stderr: ${data}`);
    });

    ytdlp.on("error", (error) => {
      console.error("yt-dlp process error:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "Download failed", error: error.message });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Download failed",
        error: error.message,
      });
    }
  }
};

module.exports = { downloadTrack };

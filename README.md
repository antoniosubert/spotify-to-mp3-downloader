# Spotify to MP3 Downloader 🎵

This project allows users to input a Spotify track URL, fetch its metadata using the Spotify API, search for the corresponding song on YouTube, and download the audio as an MP3 file using `yt-dlp` and `FFmpeg`.

> **Disclaimer**: This project is for educational purposes only. Use responsibly and ensure compliance with copyright laws and the terms of service of Spotify and YouTube.

---

## Features

- Fetch track metadata (title, artist, album, cover art) from Spotify URLs.
- Search for the track on YouTube using the YouTube Data API.
- Download the corresponding audio as an MP3 file using `yt-dlp` and `FFmpeg`.
- Simple and intuitive interface for inputting Spotify URLs.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React
- **APIs**:
  - Spotify Web API
  - YouTube Data API
- **Audio Tools**:
  - `yt-dlp` for downloading audio
  - `FFmpeg` for audio processing

---

## Prerequisites

Before setting up the project, ensure the following dependencies are installed on your system:

- **Node.js**: [Download](https://nodejs.org/)
- **FFmpeg**: [Installation Guide](https://ffmpeg.org/download.html)
- **yt-dlp**: Install via npm:
  ```bash
  npm install yt-dlp
  ```

### yt-dlp Installation

- **Linux**: `sudo apt install yt-dlp` or `sudo dnf install yt-dlp`
- **macOS**: `brew install yt-dlp`
- **Windows**: `winget install yt-dlp` or download from the official GitHub releases

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/spotify-to-mp3-downloader.git
   cd spotify-to-mp3-downloader
   ```

2. **Backend Setup**

   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and add your credentials:
     ```env
     SPOTIFY_CLIENT_ID=your_spotify_client_id
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     YOUTUBE_API_KEY=your_youtube_api_key
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**

   - Navigate to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```

4. **Ensure FFmpeg is Installed**
   Verify that FFmpeg is installed globally by running:
   ```bash
   ffmpeg -version
   ```

---

## Usage

1. Open the frontend app in your browser (typically running at `http://localhost:3000`).
2. Enter a Spotify track URL (e.g., `https://open.spotify.com/track/{track_id}`).
3. Click the "Download MP3" button.
4. The MP3 file will be downloaded to the `./downloads` directory on the backend server.

---

## File Structure

```plaintext
spotify-to-mp3-downloader/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection (optional)
│   ├── routes/
│   │   ├── spotifyRoutes.js      # Spotify API endpoints
│   │   ├── downloadRoutes.js     # Combined workflow endpoint
│   ├── utils/
│   │   ├── spotifyMetadata.js    # Fetch Spotify metadata
│   │   ├── youtubeSearch.js      # Search for YouTube videos
│   │   ├── ytDownloader.js       # Download audio with yt-dlp
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│
├── frontend/
│   ├── src/
│   │   ├── App.js                # React component
│   ├── public/
│   ├── .env                      # Frontend environment variables (if needed)
│
├── downloads/                    # MP3 files saved here
├── README.md                     # Project documentation
```

---

## Troubleshooting

### Common Issues

1. **FFmpeg Not Found**

   - Ensure FFmpeg is installed globally and added to the system PATH.
   - Run `ffmpeg -version` to confirm.

2. **YouTube API Quota Exceeded**

   - YouTube's Data API has daily usage limits. Ensure you're not exceeding the free tier.
   - Consider using multiple API keys or applying for quota increases.

3. **Spotify Invalid Client**
   - Verify your Spotify Client ID and Client Secret in the `.env` file.
   - Regenerate the credentials if necessary in the Spotify Developer Dashboard.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the project.

---

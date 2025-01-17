const axios = require("axios");

let accessToken = null;
let tokenExpiry = null;

const TOKEN_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

const getSpotifyToken = async () => {
  const now = Date.now();

  // Return existing token if still valid (with buffer time)
  if (accessToken && tokenExpiry && now < tokenExpiry - TOKEN_BUFFER) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    // Set expiry time with buffer
    tokenExpiry = now + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error(
      "Error getting Spotify token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get Spotify access token");
  }
};

module.exports = { getSpotifyToken };

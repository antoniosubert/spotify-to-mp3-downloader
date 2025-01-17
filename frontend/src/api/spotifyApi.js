import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const fetchTrackMetadata = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/spotify/metadata`, {
      url,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching track metadata:", error);
    throw error;
  }
};

export const fetchPlaylistMetadata = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/spotify/playlist`, {
      url,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist metadata:", error);
    throw error;
  }
};

export const fetchAlbumMetadata = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/spotify/album`, {
      url,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching album metadata:", error);
    throw error;
  }
};

export const downloadTrack = async (trackInfo) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/spotify/download`,
      {
        title: trackInfo.title,
        artist: trackInfo.artist,
        spotifyId: trackInfo.spotifyId,
      },
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    console.error("Error downloading track:", error);
    throw error;
  }
};

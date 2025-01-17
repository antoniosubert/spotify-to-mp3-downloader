const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotifyAuth");
const Track = require("../models/track");
const Album = require("../models/album");
const Playlist = require("../models/playlist");

const metadataCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

const handleSpotifyRequest = async (requestFn) => {
  try {
    const token = await getSpotifyToken();
    return await requestFn(token);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token might be expired, clear it and try once more
      accessToken = null;
      tokenExpiry = null;
      const newToken = await getSpotifyToken();
      return await requestFn(newToken);
    }
    throw error;
  }
};

const saveTrackToDB = async (metadata, spotifyId) => {
  try {
    const trackData = {
      ...metadata,
      spotifyId,
      metadata: {
        fetchedAt: Date.now(),
        lastUpdated: Date.now(),
      },
    };

    const existingTrack = await Track.findOne({ spotifyId });
    if (existingTrack) {
      Object.assign(existingTrack, trackData);
      await existingTrack.save();
      return existingTrack;
    }

    const track = new Track(trackData);
    await track.save();
    return track;
  } catch (error) {
    console.error("Error saving track to database:", error);
    throw error;
  }
};

const saveAlbumToDB = async (metadata, spotifyId) => {
  try {
    const albumData = {
      ...metadata,
      spotifyId,
      metadata: {
        fetchedAt: Date.now(),
        lastUpdated: Date.now(),
      },
    };

    const existingAlbum = await Album.findOne({ spotifyId });
    if (existingAlbum) {
      Object.assign(existingAlbum, albumData);
      await existingAlbum.save();
      return existingAlbum;
    }

    const album = new Album(albumData);
    await album.save();
    return album;
  } catch (error) {
    console.error("Error saving album to database:", error);
    throw error;
  }
};

const savePlaylistToDB = async (metadata, spotifyId) => {
  try {
    const playlistData = {
      ...metadata,
      spotifyId,
      metadata: {
        fetchedAt: Date.now(),
        lastUpdated: Date.now(),
      },
    };

    const existingPlaylist = await Playlist.findOne({ spotifyId });
    if (existingPlaylist) {
      Object.assign(existingPlaylist, playlistData);
      await existingPlaylist.save();
      return existingPlaylist;
    }

    const playlist = new Playlist(playlistData);
    await playlist.save();
    return playlist;
  } catch (error) {
    console.error("Error saving playlist to database:", error);
    throw error;
  }
};

const getTrackMetadata = async (req, res) => {
  const { url } = req.body;

  try {
    const urlPattern =
      /^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(?:\?|$)/;
    const match = url.match(urlPattern);
    if (!match) {
      throw new Error("Invalid Spotify track URL format");
    }
    const trackId = match[1];

    // Check DB first
    const existingTrack = await Track.findOne({ spotifyId: trackId });
    if (
      existingTrack &&
      Date.now() - existingTrack.metadata.fetchedAt < CACHE_DURATION
    ) {
      return res.json(existingTrack);
    }

    // Fetch from Spotify API
    const metadata = await handleSpotifyRequest(async (token) => {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        title: response.data.name,
        artist: response.data.artists.map((artist) => artist.name).join(", "),
        album: response.data.album.name,
        albumArt: response.data.album.images[0]?.url,
        duration: Math.floor(response.data.duration_ms / 1000),
        spotifyUrl: response.data.external_urls.spotify,
      };
    });

    // Save to DB
    const savedTrack = await saveTrackToDB(metadata, trackId);
    res.json(savedTrack);
  } catch (error) {
    console.error("Spotify API error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: "Error fetching metadata",
      error: error.message,
    });
  }
};

const getPlaylistMetadata = async (req, res) => {
  const { url } = req.body;

  try {
    // Validate URL format and extract playlist ID
    const urlPattern =
      /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(?:\?|$)/;
    const match = url.match(urlPattern);

    if (!match) {
      return res.status(400).json({
        message: "Invalid Spotify playlist URL format",
        details:
          "URL must be in format: https://open.spotify.com/playlist/{id}",
      });
    }

    const playlistId = match[1];
    const token = await getSpotifyToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const metadata = {
      title: response.data.name,
      description: response.data.description,
      owner: response.data.owner.display_name,
      trackCount: response.data.tracks.total,
      coverArt: response.data.images[0]?.url,
      spotifyUrl: response.data.external_urls.spotify,
      tracks: response.data.tracks.items.map((item) => ({
        title: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(", "),
        duration: Math.floor(item.track.duration_ms / 1000),
      })),
    };

    // Store in cache (using existing cache mechanism)
    metadataCache.set(url, {
      data: metadata,
      timestamp: Date.now(),
    });

    res.json(metadata);
  } catch (error) {
    console.error("Spotify API error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error fetching playlist metadata",
      error: error.response?.data || error.message,
    });
  }
};

const getAlbumMetadata = async (req, res) => {
  const { url } = req.body;

  try {
    // Validate URL format and extract album ID
    const urlPattern =
      /^https:\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)(?:\?|$)/;
    const match = url.match(urlPattern);

    if (!match) {
      return res.status(400).json({
        message: "Invalid Spotify album URL format",
        details: "URL must be in format: https://open.spotify.com/album/{id}",
      });
    }

    const albumId = match[1];
    const token = await getSpotifyToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const metadata = {
      title: response.data.name,
      artist: response.data.artists.map((artist) => artist.name).join(", "),
      releaseDate: response.data.release_date,
      trackCount: response.data.total_tracks,
      coverArt: response.data.images[0]?.url,
      spotifyUrl: response.data.external_urls.spotify,
      tracks: response.data.tracks.items.map((track) => ({
        title: track.name,
        duration: Math.floor(track.duration_ms / 1000),
        trackNumber: track.track_number,
      })),
    };

    // Store in cache (using existing cache mechanism)
    metadataCache.set(url, {
      data: metadata,
      timestamp: Date.now(),
    });

    res.json(metadata);
  } catch (error) {
    console.error("Spotify API error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error fetching album metadata",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  getTrackMetadata,
  getPlaylistMetadata,
  getAlbumMetadata,
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container } from "@mui/material";
import InputBox from "../components/InputBox";
import TrackList from "../components/TrackList";
import {
  fetchTrackMetadata,
  fetchPlaylistMetadata,
  fetchAlbumMetadata,
} from "../api/spotifyApi";
import ConnectionStatus from "../components/ConnectionStatus";

const Home = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await axios.get("/api/test");
        setIsConnected(true);
      } catch (err) {
        setIsConnected(false);
      }
    };
    testConnection();
    // Check connection status every 30 seconds
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFetchMetadata = async (url, type) => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      switch (type) {
        case "track":
          data = await fetchTrackMetadata(url);
          break;
        case "playlist":
          data = await fetchPlaylistMetadata(url);
          break;
        case "album":
          data = await fetchAlbumMetadata(url);
          break;
        default:
          throw new Error("Invalid Spotify URL type");
      }
      console.log("Received metadata:", data);
      setMetadata({ ...data, type });
    } catch (err) {
      setError("Failed to fetch metadata. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ConnectionStatus isConnected={isConnected} />
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          color: "primary.main",
          mb: 4,
        }}
      >
        Spotify Track Fetcher
      </Typography>

      <InputBox onFetch={handleFetchMetadata} />
      <TrackList metadata={metadata} isLoading={isLoading} error={error} />
    </Container>
  );
};

export default Home;

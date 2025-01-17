import React, { useState } from "react";
import { TextField, Button, Box, FormHelperText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const InputBox = ({ onFetch }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateSpotifyUrl = (url) => {
    const spotifyUrlRegex =
      /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+/;
    return spotifyUrlRegex.test(url);
  };

  const getSpotifyType = (url) => {
    const match = url.match(/spotify\.com\/(track|album|playlist)\//);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a Spotify URL");
      return;
    }

    if (!validateSpotifyUrl(url)) {
      setError("Please enter a valid Spotify URL");
      return;
    }

    onFetch(url, getSpotifyType(url));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        my: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter Spotify track URL (e.g., https://open.spotify.com/track/...)"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          size="medium"
          error={!!error}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
        >
          Fetch
        </Button>
      </Box>
      {error && (
        <FormHelperText error sx={{ ml: 1 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default InputBox;

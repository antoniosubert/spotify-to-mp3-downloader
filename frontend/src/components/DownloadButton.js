import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadTrack } from "../api/spotifyApi";

const DownloadButton = ({ trackInfo, onDownloadStatusChange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);
    onDownloadStatusChange?.(true);

    try {
      const response = await downloadTrack(trackInfo);

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${trackInfo.title} - ${trackInfo.artist}.mp3`.replace(
          /[/\\?%*:|"<>]/g,
          "-"
        )
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError(
        error.response?.data?.message ||
          "Failed to download track. Please try again later."
      );
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      onDownloadStatusChange?.(false);
    }
  };

  return (
    <>
      <Tooltip title="Download MP3">
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={isDownloading}
          startIcon={
            isDownloading ? (
              <CircularProgress
                size={20}
                color="inherit"
                variant={downloadProgress > 0 ? "determinate" : "indeterminate"}
                value={downloadProgress}
              />
            ) : (
              <DownloadIcon />
            )
          }
          sx={{
            minWidth: "120px",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
          }}
        >
          {isDownloading
            ? `Downloading${
                downloadProgress > 0 ? ` ${downloadProgress}%` : "..."
              }`
            : "Download"}
        </Button>
      </Tooltip>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DownloadButton;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  List,
  Button,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AlbumIcon from "@mui/icons-material/Album";
import TrackListItem from "./TrackListItem";
import DownloadButton from "./DownloadButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const TrackList = ({ metadata, isLoading, error }) => {
  const [downloadingTracks, setDownloadingTracks] = useState(new Set());

  const handleDownloadStatusChange = (trackId, isDownloading) => {
    setDownloadingTracks((prev) => {
      const newSet = new Set(prev);
      if (isDownloading) {
        newSet.add(trackId);
      } else {
        newSet.delete(trackId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    toast.error(error);
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!metadata) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Enter a Spotify URL to fetch track details
      </Alert>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handlePlay = () => {
    window.open(metadata.spotifyUrl, "_blank");
  };

  const handleDownload = async (track) => {
    try {
      const response = await axios.post(
        "/api/spotify/download",
        {
          title: track.title,
          artist: track.artist,
          spotifyId: track.spotifyId,
        },
        {
          responseType: "blob",
        }
      );

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${track.title} - ${track.artist}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download track. Please try again later.");
    }
  };

  const handleBatchDownload = async () => {
    if (!metadata.tracks) return;

    const confirmed = window.confirm(
      `Download all ${metadata.tracks.length} tracks?`
    );
    if (!confirmed) return;

    let successCount = 0;
    let failedTracks = [];

    // Show progress toast
    const progressToast = toast.loading(
      `Downloading tracks (0/${metadata.tracks.length})...`
    );

    // Download tracks sequentially
    for (let i = 0; i < metadata.tracks.length; i++) {
      const track = metadata.tracks[i];
      try {
        await handleDownload(track);
        successCount++;
        toast.update(progressToast, {
          render: `Downloading tracks (${successCount}/${metadata.tracks.length})...`,
        });
      } catch (error) {
        console.error(`Failed to download ${track.title}:`, error);
        failedTracks.push(track.title);
      }
    }

    // Show final status
    toast.dismiss(progressToast);
    if (failedTracks.length === 0) {
      toast.success(`Successfully downloaded all ${successCount} tracks!`);
    } else {
      toast.warning(
        `Downloaded ${successCount} tracks. Failed to download: ${failedTracks.join(
          ", "
        )}`
      );
    }
  };

  if (metadata?.type === "track") {
    return (
      <Card
        sx={{
          display: "flex",
          my: 2,
          bgcolor: "background.paper",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box
          sx={{ position: "relative", width: 151, height: 151, flexShrink: 0 }}
        >
          {metadata.albumArt ? (
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
              image={metadata.albumArt}
              alt={metadata.title}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.200",
              }}
            >
              <MusicNoteIcon sx={{ fontSize: 60, color: "grey.400" }} />
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0,0,0,0.4)",
              opacity: 0,
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <IconButton
              onClick={handlePlay}
              sx={{
                color: "white",
                "&:hover": { transform: "scale(1.1)" },
                transition: "transform 0.2s",
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: -120,
              backgroundColor: "primary.main",
              color: "white",
              padding: "6px 12px",
              borderRadius: "16px",
              fontSize: "0.875rem",
              boxShadow: 2,
              opacity: downloadingTracks.has(metadata.spotifyId) ? 1 : 0,
              transform: downloadingTracks.has(metadata.spotifyId)
                ? "translateX(0)"
                : "translateX(20px)",
              transition: "opacity 0.3s, transform 0.3s",
              pointerEvents: "none",
              zIndex: 1,
              "&::before": {
                content: '""',
                position: "absolute",
                left: -8,
                top: "50%",
                transform: "translateY(-50%)",
                borderStyle: "solid",
                borderWidth: "8px 8px 8px 0",
                borderColor: "transparent",
                borderRightColor: "primary.main",
              },
            }}
          >
            Downloading...
          </Box>
        </Box>

        <CardContent sx={{ flex: "1 1 auto", p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="h5" component="div">
              {metadata.title || "Unknown Title"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {metadata.artist || "Unknown Artist"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AlbumIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {metadata.album || "Unknown Album"}
              </Typography>
            </Box>
            {metadata.duration && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.floor(metadata.duration / 60)}:
                  {String(metadata.duration % 60).padStart(2, "0")}
                </Typography>
              </Box>
            )}
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <DownloadButton
              trackInfo={metadata}
              onDownloadStatusChange={(status) =>
                handleDownloadStatusChange(metadata.spotifyId, status)
              }
            />
            <Tooltip title="Share">
              <IconButton
                onClick={handleShare}
                size="small"
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Playlist or Album view
  return (
    <Card sx={{ my: 2, bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", p: 2 }}>
        {metadata?.coverArt ? (
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200 }}
            image={metadata.coverArt}
            alt={metadata.title}
          />
        ) : (
          <Box
            sx={{
              width: 200,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.200",
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 60, color: "grey.400" }} />
          </Box>
        )}
        <CardContent sx={{ flex: "1 1 auto" }}>
          <Typography variant="h5" component="div">
            {metadata?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {metadata?.type === "album" ? metadata.artist : metadata?.owner}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {metadata?.trackCount} tracks
          </Typography>
          {metadata?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {metadata.description}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleBatchDownload}
              sx={{ mr: 1 }}
            >
              Download All
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.open(metadata.spotifyUrl, "_blank")}
            >
              Open in Spotify
            </Button>
          </Box>
        </CardContent>
      </Box>
      <List sx={{ bgcolor: "background.paper" }}>
        {metadata?.tracks?.map((track, index) => (
          <TrackListItem
            key={index}
            track={track}
            index={index}
            onDownload={handleDownload}
          />
        ))}
      </List>
    </Card>
  );
};

export default TrackList;

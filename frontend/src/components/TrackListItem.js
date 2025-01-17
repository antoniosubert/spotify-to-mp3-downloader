import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TrackListItem = ({ track, onDownload, index }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <ListItem
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Typography color="text.secondary">{index + 1}</Typography>
      </ListItemIcon>
      <ListItemText
        primary={track.title}
        secondary={track.artist}
        sx={{ flex: "1 1 auto" }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {formatDuration(track.duration)}
          </Typography>
        </Box>
        <IconButton
          onClick={() => onDownload(track)}
          size="small"
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <DownloadIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default TrackListItem;

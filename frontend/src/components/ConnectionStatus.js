import React from "react";
import { Box, Tooltip } from "@mui/material";

const ConnectionStatus = ({ isConnected }) => {
  return (
    <Tooltip
      title={isConnected ? "Connected to backend" : "Backend disconnected"}
    >
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: isConnected ? "#4caf50" : "#f44336",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease",
          zIndex: 1000,
        }}
      />
    </Tooltip>
  );
};

export default ConnectionStatus;

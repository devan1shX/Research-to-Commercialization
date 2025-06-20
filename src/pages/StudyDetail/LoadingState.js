import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingState = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        mt: "64px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingState;
import React from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const BulkDocumentUpload = ({ onFilesChange, isAnalyzing }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", mb: 3, mt: 2, overflow: "hidden" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}
      >
        Upload Your Documents
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload up to 200 research papers at a time (PDF preferred). Our AI will analyze them to pre-fill the form for each study.
      </Typography>

      <Box
        component="label"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          width: "100%",
          p: 2,
          border: `2px dashed ${theme.palette.primary.main}`,
          borderRadius: "12px",
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            borderColor: theme.palette.primary.dark,
          },
        }}
      >
        <input
          type="file"
          hidden
          multiple
          accept=".pdf"
          onChange={(e) => onFilesChange(Array.from(e.target.files))}
          disabled={isAnalyzing}
        />

        <>
          <Box
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            <CloudUpload sx={{ fontSize: 48 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Upload Study Documents
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              mb: 2,
            }}
          >
            Click here or drag and drop your documents.
          </Typography>
        </>
      </Box>
    </Box>
  );
};

export default BulkDocumentUpload;
import React from "react";
import { Box, Typography, Alert, useTheme, Button } from "@mui/material";
import { CheckCircle, CloudUpload, Clear } from "@mui/icons-material";

const DocumentUploadSection = ({
  document,
  onFileChange,
  onFileRemove,
  error,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", mb: 3, mt: 2, overflow: "hidden" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}
      >
        Upload Your Document
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your research paper (PDF preferred). Our AI will analyze it to
        pre-fill the form.
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
          border: `2px dashed ${
            document
              ? theme.palette.success.main
              : error
              ? theme.palette.error.main
              : theme.palette.primary.main
          }`,
          borderRadius: "12px",
          backgroundColor: document
            ? "rgba(76, 175, 80, 0.08)"
            : error
            ? "rgba(244, 67, 54, 0.08)"
            : "rgba(25, 118, 210, 0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
          "&:hover": {
            backgroundColor: document
              ? "rgba(76, 175, 80, 0.12)"
              : error
              ? "rgba(244, 67, 54, 0.12)"
              : "rgba(25, 118, 210, 0.12)",
            borderColor: document
              ? theme.palette.success.dark
              : error
              ? theme.palette.error.dark
              : theme.palette.primary.dark,
          },
        }}
      >
        <input
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={(e) => onFileChange(e.target.files[0])}
        />

        {document ? (
          <>
            <Box sx={{ color: theme.palette.success.main, mb: 2 }}>
              <CheckCircle sx={{ fontSize: 48 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 600,
                mb: 1,
                textAlign: "center",
              }}
            >
              Document Ready for Analysis
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.success.dark,
                textAlign: "center",
                mb: 2,
                wordBreak: "break-all",
              }}
            >
              {document.name}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Clear />}
              onClick={(e) => {
                e.preventDefault();
                onFileRemove();
              }}
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              Remove
            </Button>
          </>
        ) : (
          <>
            <Box
              sx={{
                color: error
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                mb: 2,
              }}
            >
              <CloudUpload sx={{ fontSize: 48 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: error
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                fontWeight: 600,
                mb: 1,
              }}
            >
              Upload Study Document
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                mb: 2,
              }}
            >
              Click here or drag and drop your document.
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            fontSize: "0.875rem",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default DocumentUploadSection;

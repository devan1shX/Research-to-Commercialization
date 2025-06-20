import React from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";

const SubmissionStatus = ({
  isSubmitting,
  loadingAuth,
  apiError,
  successMessage,
}) => (
  <Box sx={{ width: "100%", mb: 3, mt: 3, textAlign: "center" }}>
    {apiError && (
      <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
        {apiError}
      </Alert>
    )}
    {successMessage && (
      <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
        {successMessage}
      </Alert>
    )}

    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting || loadingAuth}
      size="medium"
      sx={{
        px: { xs: 2.5, sm: 3.5 },
        py: { xs: 1.25, sm: 1.5 },
        fontSize: { xs: "0.9rem", sm: "1rem" },
        borderRadius: "12px",
        bgcolor: "#2563eb",
        color: "white",
        textTransform: "none",
        "&:hover": { bgcolor: "#1d4ed8" },
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        width: { xs: "100%", sm: "auto" },
      }}
    >
      {isSubmitting ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
          Creating Study...
        </Box>
      ) : (
        "Create Research Study"
      )}
    </Button>
  </Box>
);

export default SubmissionStatus;

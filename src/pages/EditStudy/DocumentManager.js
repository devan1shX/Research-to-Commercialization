import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  IconButton,
} from "@mui/material";
import { AttachFile, DeleteForever, Clear } from "@mui/icons-material";

const DocumentManager = ({
  existingDocuments,
  newDocuments,
  errors,
  toggleDeleteExistingDocument,
  handleExistingDocDisplayNameChange,
  handleNewDocumentFileChange,
  handleNewDocumentDisplayNameChange,
  addNewDocumentSlot,
  removeSelectedNewFile,
}) => {
  return (
    <Grid item xs={12} md={6} sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: "text.primary",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Associated Document
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 3.5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "grey.50",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: "primary.light",
            backgroundColor: "background.paper",
          },
        }}
      >
        {existingDocuments.length > 0 &&
          existingDocuments[0].status !== "delete" && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2.5,
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.9rem" },
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Current Document
              </Typography>
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  border: "1px solid",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  backgroundColor: "primary.50",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: "primary.main",
                    borderRadius: "2px 0 0 2px",
                  },
                }}
              >
                <Grid
                  container
                  spacing={{ xs: 2, sm: 2.5 }}
                  alignItems="flex-start"
                >
                  <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Display Name"
                        value={existingDocuments[0].display_name}
                        onChange={(e) =>
                          handleExistingDocDisplayNameChange(0, e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                          sx: { fontWeight: 500 },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            backgroundColor: "background.paper",
                            fontSize: { xs: "0.875rem", sm: "0.9rem" },
                            "& fieldset": { borderColor: "divider" },
                            "&:hover fieldset": { borderColor: "primary.main" },
                            "&.Mui-focused fieldset": { borderWidth: "2px" },
                          },
                        }}
                        error={!!errors[`existing_document_display_name_0`]}
                        helperText={errors[`existing_document_display_name_0`]}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          minWidth: "fit-content",
                        }}
                      >
                        Attached:
                      </Typography>
                      {existingDocuments[0].file_location ? (
                        <Link
                          href={
                            existingDocuments[0].file_location.startsWith(
                              "http"
                            )
                              ? existingDocuments[0].file_location
                              : `http://localhost:5000/${existingDocuments[0].file_location}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            wordBreak: "break-all",
                            fontSize: { xs: "0.75rem", sm: "0.8rem" },
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          📎{" "}
                          {existingDocuments[0].file_location.split("/").pop()}
                        </Link>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{ color: "text.disabled", fontStyle: "italic" }}
                        >
                          No file associated
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Button
                      onClick={() => toggleDeleteExistingDocument(0)}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteForever />}
                      fullWidth
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 500,
                        height: { xs: "36px", sm: "40px" },
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                          "& .MuiSvgIcon-root": { color: "white" },
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

        {(existingDocuments.length === 0 ||
          existingDocuments[0].status === "delete") && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2.5,
                color: "text.secondary",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9rem" },
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Add New Document
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Display Name"
                  value={
                    newDocuments.length > 0 ? newDocuments[0].display_name : ""
                  }
                  onChange={(e) => {
                    if (newDocuments.length === 0) {
                      addNewDocumentSlot();
                    }
                    handleNewDocumentDisplayNameChange(0, e);
                  }}
                  placeholder="Enter document name"
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 500 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      backgroundColor: "background.paper",
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      height: { xs: "48px", sm: "56px" },
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused fieldset": { borderWidth: "2px" },
                    },
                  }}
                  error={!!errors[`new_document_display_name_0`]}
                  helperText={errors[`new_document_display_name_0`]}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    height: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AttachFile />}
                    sx={{
                      height: { xs: "48px", sm: "56px" },
                      borderRadius: 1.5,
                      textTransform: "none",
                      justifyContent: "flex-start",
                      backgroundColor: "background.paper",
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      fontWeight: 500,
                      color:
                        newDocuments.length > 0 && newDocuments[0].file
                          ? "success.main"
                          : "text.secondary",
                      borderColor: errors[`new_document_file_0`]
                        ? "error.main"
                        : "divider",
                      px: { xs: 2, sm: 2.5 },
                      "&:hover": {
                        backgroundColor: "action.hover",
                        borderColor: "primary.main",
                      },
                      "& .MuiButton-startIcon": {
                        marginRight: { xs: 1, sm: 1.5 },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        textAlign: "left",
                      }}
                    >
                      {newDocuments.length > 0 && newDocuments[0].file
                        ? newDocuments[0].file.name
                        : "Choose file"}
                    </Box>
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        if (newDocuments.length === 0) {
                          addNewDocumentSlot();
                        }
                        handleNewDocumentFileChange(0, e);
                      }}
                    />
                  </Button>
                  {newDocuments.length > 0 && newDocuments[0].file && (
                    <IconButton
                      size="small"
                      onClick={() => removeSelectedNewFile(0)}
                      sx={{
                        color: "error.main",
                        flexShrink: 0,
                        mt: { xs: "6px", sm: "8px" },
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                        },
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {errors[`new_document_file_0`] && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      mt: 1,
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {errors[`new_document_file_0`]}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {existingDocuments.length > 0 &&
          existingDocuments[0].status === "delete" && (
            <Box
              sx={{
                mt: 3,
                p: { xs: 2, sm: 2.5 },
                backgroundColor: "warning.50",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "warning.light",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box sx={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</Box>
              <Typography
                variant="body2"
                sx={{
                  color: "warning.dark",
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "0.9rem" },
                }}
              >
                Current document will be removed when you save changes.
              </Typography>
            </Box>
          )}
        {newDocuments.length > 0 && newDocuments[0].file && (
          <Box
            sx={{
              mt: 3,
              p: { xs: 2, sm: 2.5 },
              backgroundColor: "success.50",
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "success.light",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{ fontSize: "1.2rem", flexShrink: 0 }}>✅</Box>
            <Typography
              variant="body2"
              sx={{
                color: "success.dark",
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "0.9rem" },
              }}
            >
              New document ready to be uploaded when you save changes.
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default DocumentManager;

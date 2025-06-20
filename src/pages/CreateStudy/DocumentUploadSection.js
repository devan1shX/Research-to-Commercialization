import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  useTheme,
} from "@mui/material";
import {
  AddCircleOutline,
  CheckCircle,
  CloudUpload,
  Clear,
} from "@mui/icons-material";

const DocumentUploadSection = ({
  documents,
  errors,
  addDocumentField,
  handleDocumentDisplayNameChange,
  handleDocumentFileChange,
  removeSelectedFile,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", mb: 3, mt: 2, overflow: "hidden" }}>
      <Stack spacing={3} mt={2}>
        {documents.map((doc, index) => (
          <Box key={index} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Document Name"
              value={doc.display_name}
              onChange={(e) => handleDocumentDisplayNameChange(index, e)}
              error={!!errors[`document_display_name_${index}`]}
              helperText={errors[`document_display_name_${index}`]}
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />

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
                  doc.file
                    ? theme.palette.success.main
                    : errors[`document_file_${index}`]
                    ? theme.palette.error.main
                    : theme.palette.primary.main
                }`,
                borderRadius: "12px",
                backgroundColor: doc.file
                  ? "rgba(76, 175, 80, 0.08)"
                  : errors[`document_file_${index}`]
                  ? "rgba(244, 67, 54, 0.08)"
                  : "rgba(25, 118, 210, 0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                "&:hover": {
                  backgroundColor: doc.file
                    ? "rgba(76, 175, 80, 0.12)"
                    : errors[`document_file_${index}`]
                    ? "rgba(244, 67, 54, 0.12)"
                    : "rgba(25, 118, 210, 0.12)",
                  borderColor: doc.file
                    ? theme.palette.success.dark
                    : errors[`document_file_${index}`]
                    ? theme.palette.error.dark
                    : theme.palette.primary.dark,
                },
              }}
            >
              <input
                type="file"
                hidden
                onChange={(e) => handleDocumentFileChange(index, e)}
              />

              {doc.file ? (
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
                      wordBreak: "break-word",
                    }}
                  >
                    Document Uploaded Successfully
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.success.main,
                      textAlign: "center",
                      mb: 2,
                      wordBreak: "break-word",
                      overflow: "hidden",
                    }}
                  >
                    {doc.file.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeSelectedFile(index);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "transparent",
                        color: theme.palette.error.main,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <Clear fontSize="small" />
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      color: errors[`document_file_${index}`]
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
                      color: errors[`document_file_${index}`]
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 1,
                      textAlign: "center",
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
                      maxWidth: "90%",
                    }}
                  >
                    Click here or drag and drop your document. PDF, DOC, DOCX
                    files are supported.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.error.main,
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    * Document upload is required
                  </Typography>
                </>
              )}
            </Box>

            {errors[`document_file_${index}`] && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                {errors[`document_file_${index}`]}
              </Alert>
            )}
          </Box>
        ))}

        {documents.length < 1 && (
          <Button
            startIcon={<AddCircleOutline />}
            onClick={addDocumentField}
            variant="outlined"
            sx={{
              width: "100%",
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              borderWidth: "2px",
              borderStyle: "dashed",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              backgroundColor: "rgba(25, 118, 210, 0.04)",
              "&:hover": {
                borderStyle: "solid",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            Add Document
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default DocumentUploadSection;

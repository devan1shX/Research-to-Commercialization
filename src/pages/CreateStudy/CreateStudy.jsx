import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
  Stack,
  Card,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore } from "@mui/icons-material";

import {
  AddCircleOutline,
  RemoveCircleOutline,
  AttachFile,
  Clear,
  Quiz,
  Info,
  CloudUpload,
  Gavel,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const suggestedGenres = [
  "Computer Science",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Medicine",
  "Engineering",
  "Social Science",
  "Arts & Humanities",
  "Environmental Science",
  "Psychology",
  "Economics",
  "Business",
  "Education",
  "History",
  "Law",
  "Political Science",
];

const patentStatuses = ["Patented", "Unpatented", "Patent Pending"];

const steps = [
  "Basic Information",
  "Classification",
  "Documents",
  "Additional Details",
];

const CreateStudy = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();
  const theme = useTheme();

  const initialDocumentState = { file: null, display_name: "" };
  const initialQuestionState = { question: "", answer: "" };
  const initialAdditionalInfoState = { key: "", value: "" };

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    brief_description: "",
    genres: [],
    documents: [], // Start with no document fields by default, or one if preferred
    patent_status: "",
    questions: [],
    additional_info: [],
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      navigate("/login", { state: { from: "/create-study" } });
    }
  }, [currentUser, loadingAuth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGenresChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, genres: newValue }));
  };

  // --- Generic Array Item Handlers ---
  const handleArrayItemChange = useCallback(
    (arrayName, index, event) => {
      const { name: fieldName, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) =>
          i === index ? { ...item, [fieldName]: value } : item
        ),
      }));
      if (errors[`${arrayName}_${fieldName}_${index}`]) {
        setErrors((prev) => ({
          ...prev,
          [`${arrayName}_${fieldName}_${index}`]: null,
        }));
      }
    },
    [errors]
  );

  const addArrayItem = useCallback((arrayName, initialItemState) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...initialItemState }],
    }));
  }, []);

  const removeArrayItem = useCallback((arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
    // Consider clearing errors related to the removed item
  }, []);

  // --- Document Specific Handlers ---
  const handleDocumentFileChange = (index, event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index
          ? {
              ...doc,
              file: file,
              display_name: doc.display_name || (file ? file.name : ""),
            }
          : doc
      ),
    }));
    if (errors[`document_file_${index}`]) {
      setErrors((prev) => ({ ...prev, [`document_file_${index}`]: null }));
    }
  };

  const handleDocumentDisplayNameChange = (index, event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, display_name: value } : doc
      ),
    }));
    if (errors[`document_display_name_${index}`]) {
      setErrors((prev) => ({
        ...prev,
        [`document_display_name_${index}`]: null,
      }));
    }
  };

  const addDocumentField = () => {
    if (formData.documents.length < 5) {
      addArrayItem("documents", initialDocumentState);
    }
  };

  const removeDocumentField = (index) => removeArrayItem("documents", index);

  const removeSelectedFile = (docIndex) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === docIndex ? { ...doc, file: null } : doc
      ),
    }));
  };

  // --- Validation ---
  const validatePairedFields = (
    items,
    keyField,
    valueField,
    errorKeyPrefix,
    currentErrors,
    itemLabelSingular
  ) => {
    items.forEach((item, index) => {
      const keyTrimmed = String(item[keyField] || "").trim();
      const valueTrimmed = String(item[valueField] || "").trim();
      const hasPartialData = keyTrimmed || valueTrimmed;

      if (hasPartialData) {
        if (!keyTrimmed)
          currentErrors[`${errorKeyPrefix}_${keyField}_${index}`] = `${
            keyField.charAt(0).toUpperCase() + keyField.slice(1)
          } for ${itemLabelSingular} ${index + 1} is required.`;
        if (!valueTrimmed)
          currentErrors[`${errorKeyPrefix}_${valueField}_${index}`] = `${
            valueField.charAt(0).toUpperCase() + valueField.slice(1)
          } for ${itemLabelSingular} ${index + 1} is required.`;
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.abstract.trim()) newErrors.abstract = "Abstract is required.";
    if (!formData.brief_description.trim())
      newErrors.brief_description = "Brief description is required.";

    formData.documents.forEach((doc, index) => {
      const displayNameTrimmed = String(doc.display_name || "").trim();
      if (doc.file && !displayNameTrimmed) {
        newErrors[
          `document_display_name_${index}`
        ] = `Display name for document ${
          index + 1
        } is required if a file is selected.`;
      }
      // If a display name is provided, a file must be selected (unless it's an empty, removable slot)
      if (displayNameTrimmed && !doc.file) {
        newErrors[`document_file_${index}`] = `File for document ${
          index + 1
        } is required if a display name is provided.`;
      }
    });

    validatePairedFields(
      formData.questions,
      "question",
      "answer",
      "question",
      newErrors,
      "question"
    );
    validatePairedFields(
      formData.additional_info,
      "key",
      "value",
      "additional_info",
      newErrors,
      "info"
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      setApiError("Please correct the errors in the form.");
      return;
    }

    if (!currentUser) {
      setApiError("You must be logged in to create a study.");
      return;
    }
    setIsSubmitting(true);

    const submissionFormData = new FormData();
    submissionFormData.append("title", formData.title.trim());
    submissionFormData.append("abstract", formData.abstract.trim());
    submissionFormData.append(
      "brief_description",
      formData.brief_description.trim()
    );

    if (formData.genres.length > 0) {
      submissionFormData.append("genres", JSON.stringify(formData.genres));
    }
    if (formData.patent_status) {
      submissionFormData.append("patent_status", formData.patent_status);
    }

    const documentsMetadata = [];
    formData.documents.forEach((doc) => {
      if (doc.file && doc.display_name.trim()) {
        submissionFormData.append(
          "study_document_files",
          doc.file,
          doc.file.name
        );
        documentsMetadata.push({ display_name: doc.display_name.trim() });
      }
    });
    if (documentsMetadata.length > 0) {
      submissionFormData.append(
        "documents_metadata",
        JSON.stringify(documentsMetadata)
      );
    }

    const filteredQuestions = formData.questions.filter(
      (qa) => qa.question.trim() && qa.answer.trim()
    );
    if (filteredQuestions.length > 0) {
      submissionFormData.append("questions", JSON.stringify(filteredQuestions));
    }

    const transformedAdditionalInfo = formData.additional_info.reduce(
      (obj, item) => {
        if (item.key.trim() && item.value.trim()) {
          obj[item.key.trim()] = item.value.trim();
        }
        return obj;
      },
      {}
    );
    if (Object.keys(transformedAdditionalInfo).length > 0) {
      submissionFormData.append(
        "additional_info",
        JSON.stringify(transformedAdditionalInfo)
      );
    }

    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch("http://localhost:5000/studies", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submissionFormData,
      });
      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = responseData.message || `Error: ${response.status}`;
        if (responseData && responseData.errors) {
          const backendErrors = {};
          responseData.errors.forEach((err) => {
            backendErrors[err.field] = err.message;
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          errorMessage =
            responseData.message ||
            "Validation failed. Please check the fields.";
        }
        throw new Error(errorMessage);
      }
      setSuccessMessage("Study created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Failed to create study:", error);
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAuth) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const commonTextFieldProps = (
    name,
    label,
    required = false,
    helperText = ""
  ) => ({
    fullWidth: true,
    variant: "outlined",
    margin: "normal",
    name: name,
    label: label,
    value: formData[name] || "",
    onChange: handleChange,
    required: required,
    error: !!errors[name],
    helperText: errors[name] || helperText,
    InputLabelProps: { shrink: true },
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        "&.Mui-focused": {
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          "& fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: "2px",
          },
        },
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
        fontWeight: 600,
      },
    },
  });


  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -10,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.8,
  };

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      sx={{
        backgroundColor: "#F9FAFB",
        paddingTop: { xs: "100px", sm: "120px", md: "120px" },
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 0,
          paddingLeft: { xs: "26px", sm: "32px", md: "70px" },
          paddingRight: { xs: "26px", sm: "32px", md: "70px" },
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 4 }}>
          {/* Header Section */}

          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: "600",
              color: "#1a1a1a",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Create Research Study
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "1.1rem",
              maxWidth: "1200px",
            }}
          >
            Share your research with the scientific community and collaborate
            with fellow researchers
          </Typography>

          {/* Main Form */}
          {/* Main Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: { xs: 3, sm: 3, md: 3 },
              width: "100%", // Ensure complete width
              maxWidth: "none", // Remove any max-width constraints
            }}
          >
            {/* Title Field - Full Width Row */}
            <Box sx={{ mb: 1 }}>
              <TextField
                {...commonTextFieldProps("title", "Study Title", true)}
                placeholder="Enter a descriptive title for your research study"
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    width: "100%",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                  },
                }}
              />
            </Box>

            {/* Abstract Field - Full Width Row */}
            <Box sx={{ mb: 1 }}>
              <TextField
                {...commonTextFieldProps("abstract", "Abstract", true)}
                multiline
                rows={4}
                placeholder="Provide a comprehensive abstract of your research..."
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    width: "100%",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                  },
                }}
              />
            </Box>

            {/* Brief Description Field - Full Width Row */}
            <Box sx={{ mb: 3 }}>
              <TextField
                {...commonTextFieldProps(
                  "brief_description",
                  "Brief Description",
                  true
                )}
                multiline
                rows={3}
                placeholder="Write a brief description highlighting key aspects..."
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    width: "100%",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                  },
                }}
              />
            </Box>

            {/* Patent and Genre */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, mb: 1 }}>
                <Autocomplete
                  multiple
                  options={suggestedGenres}
                  value={formData.genres}
                  onChange={(event, newValue) => {
                    if (newValue.length <= 3) {
                      handleGenresChange(event, newValue);
                    }
                  }}
                  freeSolo
                  disablePortal
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      placement="bottom-start"
                      modifiers={[
                        {
                          name: "offset",
                          options: {
                            offset: [0, 4],
                          },
                        },
                      ]}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="filled"
                        label={option}
                        {...getTagProps({ index })}
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          color: theme.palette.primary.main,
                          "& .MuiChip-deleteIcon": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => {
                    const remaining = 3 - formData.genres.length;
                    let placeholder = "Type or select research areas";

                    if (formData.genres.length > 0) {
                      if (remaining > 1) {
                        placeholder = `You can add ${remaining} more`;
                      } else if (remaining === 1) {
                        placeholder = "You can add 1 more";
                      } else {
                        // When 3 are selected, the placeholder is empty
                        placeholder = "";
                      }
                    }

                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Research Genres"
                        placeholder={placeholder}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            width: "100%",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                          },
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, mb: 1 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                      // The padding is no longer an issue since the external label is gone.
                      // You can adjust this as needed for your design.
                      paddingTop: "18.5px",
                      paddingBottom: "18.5px",
                    },
                  }}
                >
                  {/* The separate InputLabel component has been removed. */}
                  <Select
                    name="patent_status"
                    value={formData.patent_status}
                    onChange={handleChange}
                    displayEmpty
                    // The renderValue prop now handles the placeholder display.
                    renderValue={(selected) => {
                      if (!selected) {
                        // This is the custom placeholder shown when no value is selected.
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: (theme) => theme.palette.text.secondary, // Style as placeholder text
                            }}
                          >
                            <Gavel sx={{ mr: 1, fontSize: 20 }} />
                            Patent Status
                          </Box>
                        );
                      }
                      // This displays the value once it has been selected.
                      return selected;
                    }}
                  >
                    {/* This first MenuItem is what the user sees in the list for the empty state. */}
                    <MenuItem value="">
                      <em>Not Specified</em>
                    </MenuItem>
                    {patentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Documents Section */}
            <Box sx={{ width: "100%", mb: 3 }}>
              <Stack spacing={2.5} mt={2}>
                {formData.documents.map((doc, index) => (
                  <Box key={index}>
                    {/* Main Responsive Container */}
                    <Box
                      sx={{
                        display: "flex",
                        // For extra-small (xs) screens, stack them vertically.
                        // For medium (md) screens and up, place them in a row.
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      {/* Document Name TextField */}
                      <Box
                        sx={{
                          // On xs screens, take full width. On md and up, take 75%.
                          width: { xs: "100%", md: "75%" },
                        }}
                      >
                        <TextField
                          fullWidth // fullWidth is fine now as its container's width is controlled
                          variant="outlined"
                          size="small"
                          label="Document Name"
                          value={doc.display_name}
                          onChange={(e) =>
                            handleDocumentDisplayNameChange(index, e)
                          }
                          error={!!errors[`document_display_name_${index}`]}
                          helperText={errors[`document_display_name_${index}`]}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Box>

                      {/* Container for the Button and Icon */}
                      <Box
                        sx={{
                          // On xs screens, take full width. On md and up, take 25%.
                          width: { xs: "100%", md: "25%" },
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {/* File Upload Button */}
                        <Button
                          variant={doc.file ? "outlined" : "contained"}
                          component="label"
                          startIcon={
                            doc.file ? <AttachFile /> : <CloudUpload />
                          }
                          sx={{
                            flex: 1, // Make the button fill the available space in its container
                            minWidth: 0, // Allow the button to shrink and not overflow
                            height: "40px",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            ...(doc.file && {
                              backgroundColor: alpha(
                                theme.palette.success.main,
                                0.1
                              ),
                              color: theme.palette.success.main,
                              borderColor: theme.palette.success.main,
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.success.main,
                                  0.15
                                ),
                              },
                            }),
                          }}
                        >
                          {doc.file
                            ? `${doc.file.name.substring(0, 20)}${
                                doc.file.name.length > 20 ? "..." : ""
                              }`
                            : "Choose File"}
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleDocumentFileChange(index, e)}
                          />
                        </Button>
                        {doc.file && (
                          <IconButton
                            size="small"
                            onClick={() => removeSelectedFile(index)}
                          >
                            <Clear fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    {errors[`document_file_${index}`] && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1.5,
                          fontSize: "0.75rem",
                          borderRadius: "8px",
                        }}
                      >
                        {errors[`document_file_${index}`]}
                      </Alert>
                    )}
                  </Box>
                ))}
                {/* Add Document Button (no changes needed here) */}
                {formData.documents.length < 1 && (
                  <Button
                    startIcon={<AddCircleOutline />}
                    onClick={addDocumentField}
                    variant="outlined"
                    sx={{
                      width: "100%",
                      mt: 1,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Add Document
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Custom Information Fields */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Additional Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add custom key-value pairs for extra information.
              </Typography>

              {/* Main container with border */}
              <Box
                sx={{
                  borderRadius: "12px",
                }}
              >
                {formData.additional_info.map((item, index) => (
                  // Use React.Fragment to handle mapping and dividers
                  <React.Fragment key={index}>
                    {/* Each row is now an explicit flexbox container */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2.5,
                        gap: 2,
                      }}
                    >
                      {/* This container for the text fields is told to GROW */}
                      <Box sx={{ flex: 1 }}>
                        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              label="Field Name"
                              name="key"
                              value={item.key}
                              onChange={(e) =>
                                handleArrayItemChange(
                                  "additional_info",
                                  index,
                                  e
                                )
                              }
                              error={!!errors[`additional_info_key_${index}`]}
                              helperText={
                                errors[`additional_info_key_${index}`]
                              }
                              placeholder="e.g., Target Audience"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "background.paper",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              label="Field Value"
                              name="value"
                              value={item.value}
                              onChange={(e) =>
                                handleArrayItemChange(
                                  "additional_info",
                                  index,
                                  e
                                )
                              }
                              error={!!errors[`additional_info_value_${index}`]}
                              helperText={
                                errors[`additional_info_value_${index}`]
                              }
                              placeholder="e.g., Researchers, Students"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "background.paper",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* This container for the button will NOT grow */}
                      <Box sx={{ flexShrink: 0 }}>
                        <IconButton
                          onClick={() =>
                            removeArrayItem("additional_info", index)
                          }
                          color="error"
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Manually add a divider between items */}
                    {index < formData.additional_info.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>

              <Box
                sx={{ pt: 0, display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  startIcon={<AddCircleOutline />}
                  onClick={() =>
                    addArrayItem("additional_info", initialAdditionalInfoState)
                  }
                  variant="text"
                  sx={{
                    color: theme.palette.info.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.info.main, 0.08),
                    },
                  }}
                >
                  Add another field
                </Button>
              </Box>
            </Box>

            {/* FAQ Subsection */}

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Frequently Asked Questions
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add common questions and answers about your research.
              </Typography>

              <Stack spacing={1.5}>
                {formData.questions.map((qa, index) => (
                  <Accordion
                    key={index}
                    disableGutters
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "12px",
                      backgroundColor: "transparent",
                      "&:before": {
                        display: "none",
                      },
                      "&.Mui-expanded": {
                        my: 1.5,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        "& .MuiAccordionSummary-content": {
                          display: "flex",
                          alignItems: "flex-start", // Align items to the top
                          justifyContent: "space-between",
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.action.hover,
                            0.03
                          ),
                        },
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          color: "text.primary",
                          pr: 2, // Keep padding to prevent text from touching the button
                          // Removed whiteSpace and textOverflow to allow wrapping
                        }}
                      >
                        {qa.question.trim() || `Question ${index + 1}`}
                      </Typography>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          removeArrayItem("questions", index);
                        }}
                        color="error"
                        size="small"
                        sx={{
                          // Use margin top to align with the first line of text if needed
                          // mt: -0.5,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 2.5 }}>
                      <Stack spacing={2.5}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Question"
                          name="question"
                          value={qa.question}
                          onChange={(e) =>
                            handleArrayItemChange("questions", index, e)
                          }
                          error={!!errors[`question_question_${index}`]}
                          helperText={errors[`question_question_${index}`]}
                          multiline
                          minRows={2}
                          placeholder="e.g., What is the main objective of this study?"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "background.paper",
                            },
                          }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Answer"
                          name="answer"
                          value={qa.answer}
                          onChange={(e) =>
                            handleArrayItemChange("questions", index, e)
                          }
                          error={!!errors[`answer_answer_${index}`]}
                          helperText={errors[`answer_answer_${index}`]}
                          multiline
                          minRows={4}
                          placeholder="Provide a clear and comprehensive answer."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "background.paper",
                            },
                          }}
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}

                <Box
                  sx={{ pt: 1, display: "flex", justifyContent: "flex-start" }}
                >
                  <Button
                    startIcon={<AddCircleOutline />}
                    onClick={() =>
                      addArrayItem("questions", initialQuestionState)
                    }
                    variant="text"
                    sx={{
                      color: theme.palette.info.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.info.main, 0.08),
                      },
                    }}
                  >
                    Add another question
                  </Button>
                </Box>
              </Stack>
            </Box>

            {/* Submit Section */}

            <Box
              sx={{
                width: "100%",
                mb: 3,
                mt: 3,
                textAlign: "center",
              }}
            >
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
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },
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
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 2 }}
                    />
                    Creating Study...
                  </Box>
                ) : (
                  "Create Research Study"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateStudy;

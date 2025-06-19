import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Adjust path if necessary
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
  Link,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  AttachFile,
  DeleteForever,
  Clear,
  Gavel,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Popper from "@mui/material/Popper";

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

const EditStudy = () => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();

  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    brief_description: "",
    genres: [],
    patent_status: "",
    questions: [],
    additional_info: [], // Array of { key: string, value: string }
  });

  const [existingDocuments, setExistingDocuments] = useState([]); // { _id?, display_name, file_location, status: 'keep' | 'delete' }
  const [newDocuments, setNewDocuments] = useState([]); // { file: File | null, display_name: string }

  const [initialResearcherId, setInitialResearcherId] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // For fetching initial data
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialQuestionState = { question: "", answer: "" };
  const initialAdditionalInfoState = { key: "", value: "" };
  const initialNewDocumentState = { file: null, display_name: "" };

  // Fetch existing study data
  const fetchStudyData = useCallback(async () => {
    if (!studyId || !currentUser) {
      setIsLoading(false);
      if (!currentUser && !loadingAuth) navigate("/login");
      return;
    }
    setIsLoading(true);
    setApiError("");
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(`http://localhost:5000/studies/${studyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.message || `Failed to fetch study data: ${response.status}`
        );
      }
      const data = await response.json();

      if (data.researcher_id !== currentUser.uid) {
        setApiError("You are not authorized to edit this study.");
        setIsLoading(false);
        // Optionally navigate away after a delay
        setTimeout(() => navigate("/dashboard"), 3000);
        return;
      }
      setInitialResearcherId(data.researcher_id);

      setFormData({
        title: data.title || "",
        abstract: data.abstract || "",
        brief_description: data.brief_description || "",
        genres: Array.isArray(data.genres) ? data.genres : [],
        patent_status: data.patent_status || "",
        questions: Array.isArray(data.questions)
          ? data.questions.map((q) => ({
              question: q.question || "",
              answer: q.answer || "",
            }))
          : [],
        additional_info:
          data.additional_info && typeof data.additional_info === "object"
            ? Object.entries(data.additional_info).map(([key, value]) => ({
                key,
                value: String(value),
              }))
            : [],
      });
      setExistingDocuments(
        Array.isArray(data.documents)
          ? data.documents.map((doc) => ({ ...doc, status: "keep" }))
          : []
      );
    } catch (error) {
      console.error("Error fetching study data:", error);
      setApiError(error.message || "Could not load study data.");
    } finally {
      setIsLoading(false);
    }
  }, [studyId, currentUser, navigate, loadingAuth]);

  useEffect(() => {
    if (!loadingAuth) {
      if (currentUser) {
        fetchStudyData();
      } else {
        navigate("/login", { state: { from: `/edit-study/${studyId}` } });
      }
    }
  }, [currentUser, loadingAuth, fetchStudyData, navigate, studyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleGenresChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, genres: newValue }));
  };

  // --- Existing Document Handlers ---
  const toggleDeleteExistingDocument = (docIndex) => {
    setExistingDocuments((prev) =>
      prev.map((doc, i) =>
        i === docIndex
          ? { ...doc, status: doc.status === "delete" ? "keep" : "delete" }
          : doc
      )
    );
  };
  const handleExistingDocDisplayNameChange = (docIndex, value) => {
    setExistingDocuments((prev) =>
      prev.map((doc, i) =>
        i === docIndex ? { ...doc, display_name: value } : doc
      )
    );
  };

  // --- New Document Handlers ---
  const handleNewDocumentFileChange = (index, event) => {
    const file = event.target.files[0];
    setNewDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? {
              ...doc,
              file: file,
              display_name: doc.display_name || (file ? file.name : ""),
            }
          : doc
      )
    );
  };
  const handleNewDocumentDisplayNameChange = (index, event) => {
    const { value } = event.target;
    setNewDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, display_name: value } : doc
      )
    );
  };
  const addNewDocumentSlot = () => {
    if (
      existingDocuments.filter((d) => d.status === "keep").length +
        newDocuments.length <
      5
    ) {
      setNewDocuments((prev) => [...prev, { ...initialNewDocumentState }]);
    } else {
      setApiError("Cannot add more than 5 documents in total.");
    }
  };
  const removeNewDocumentSlot = (index) => {
    setNewDocuments((prev) => prev.filter((_, i) => i !== index));
  };
  const removeSelectedNewFile = (docIndex) => {
    setNewDocuments((prev) =>
      prev.map((doc, i) => (i === docIndex ? { ...doc, file: null } : doc))
    );
  };

  // --- Question Handlers (same as CreateStudy) ---
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((qa, i) =>
        i === index ? { ...qa, [name]: value } : qa
      ),
    }));
  };
  const addQuestionField = () =>
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...initialQuestionState }],
    }));
  const removeQuestionField = (index) =>
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));

  // --- Additional Info Handlers (same as CreateStudy) ---
  const handleAdditionalInfoChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      additional_info: prev.additional_info.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };
  const addAdditionalInfoField = () =>
    setFormData((prev) => ({
      ...prev,
      additional_info: [
        ...prev.additional_info,
        { ...initialAdditionalInfoState },
      ],
    }));
  const removeAdditionalInfoField = (index) =>
    setFormData((prev) => ({
      ...prev,
      additional_info: prev.additional_info.filter((_, i) => i !== index),
    }));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.abstract.trim()) newErrors.abstract = "Abstract is required.";
    if (!formData.brief_description.trim())
      newErrors.brief_description = "Brief description is required.";

    existingDocuments.forEach((doc, index) => {
      if (doc.status === "keep" && !doc.display_name.trim()) {
        newErrors[
          `existing_document_display_name_${index}`
        ] = `Display name for existing document ${index + 1} is required.`;
      }
    });
    newDocuments.forEach((doc, index) => {
      if (doc.file && !doc.display_name.trim()) {
        newErrors[
          `new_document_display_name_${index}`
        ] = `Display name for new document ${index + 1} is required.`;
      }
      if (!doc.file && doc.display_name.trim()) {
        newErrors[`new_document_file_${index}`] = `File for new document ${
          index + 1
        } is required if a display name is provided.`;
      }
    });
    // ... (add validation for questions and additional_info if needed, similar to CreateStudy)
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
    if (!currentUser || currentUser.uid !== initialResearcherId) {
      setApiError("Unauthorized or session issue. Please re-login.");
      return;
    }

    setIsSubmitting(true);
    const submissionFormData = new FormData();

    // Append text fields
    submissionFormData.append("title", formData.title.trim());
    submissionFormData.append("abstract", formData.abstract.trim());
    submissionFormData.append(
      "brief_description",
      formData.brief_description.trim()
    );
    if (formData.genres.length > 0)
      submissionFormData.append("genres", JSON.stringify(formData.genres));
    if (formData.patent_status)
      submissionFormData.append("patent_status", formData.patent_status);

    const filteredQuestions = formData.questions.filter(
      (qa) => qa.question.trim() && qa.answer.trim()
    );
    if (filteredQuestions.length > 0)
      submissionFormData.append("questions", JSON.stringify(filteredQuestions));

    const transformedAdditionalInfo = formData.additional_info.reduce(
      (obj, item) => {
        if (item.key.trim() && item.value.trim())
          obj[item.key.trim()] = item.value.trim();
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

    // Handle documents
    const keptExistingDocuments = existingDocuments
      .filter((doc) => doc.status === "keep")
      .map((doc) => ({
        display_name: doc.display_name,
        file_location: doc.file_location,
        _id: doc._id,
      })); // Send _id if your backend uses it for matching
    submissionFormData.append(
      "kept_documents_metadata",
      JSON.stringify(keptExistingDocuments)
    );

    const deletedDocumentLocations = existingDocuments
      .filter((doc) => doc.status === "delete")
      .map((doc) => doc.file_location); // Send locations of files to be deleted on backend
    if (deletedDocumentLocations.length > 0) {
      submissionFormData.append(
        "deleted_documents_locations",
        JSON.stringify(deletedDocumentLocations)
      );
    }

    const newDocumentsMetadata = [];
    newDocuments.forEach((doc) => {
      if (doc.file) {
        submissionFormData.append(
          "study_document_files",
          doc.file,
          doc.file.name
        ); // New files
        newDocumentsMetadata.push({
          display_name: doc.display_name.trim() || doc.file.name,
        });
      }
    });
    if (newDocumentsMetadata.length > 0) {
      submissionFormData.append(
        "new_documents_metadata",
        JSON.stringify(newDocumentsMetadata)
      );
    }

    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(`http://localhost:5000/studies/${studyId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // No Content-Type for FormData
        body: submissionFormData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! Status: ${response.status}`
        );
      }
      setSuccessMessage("Study updated successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Failed to update study:", error);
      setApiError(
        error.message || "An unexpected error occurred during update."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }
  if (
    !currentUser ||
    (initialResearcherId &&
      currentUser.uid !== initialResearcherId &&
      !apiError)
  ) {
    // This case should be caught by fetchStudyData's authorization check which sets apiError
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          You are not authorized to view this page or the study does not exist.
        </Alert>
      </Container>
    );
  }

  const commonTextFieldProps = (name, label, required = false) => ({
    fullWidth: true,
    variant: "outlined",
    margin: "normal",
    name: name,
    label: label,
    value: formData[name] || "",
    onChange: handleChange,
    required: required,
    error: !!errors[name],
    helperText: errors[name] || "",
    InputLabelProps: { shrink: true },
    sx: {
      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
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
            Edit Research Study
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
            {/* Basic Info */}
            <Grid item xs={12}>
              <TextField
                {...commonTextFieldProps("title", "Study Title", true)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...commonTextFieldProps("abstract", "Abstract", true)}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...commonTextFieldProps(
                  "brief_description",
                  "Brief Description",
                  true
                )}
                multiline
                rows={3}
              />
            </Grid>

            {/* Genres & Patent Status */}
            <Grid item xs={12} md={6} sx={{ mt: { xs: 2, sm: 2, md: 2 } }}>
              <Autocomplete
                multiple
                options={suggestedGenres}
                value={formData.genres}
                onChange={(event, newValue) => {
                  // Ensure only 3 genres can be selected
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: { xs: 2, sm: 2, md: 2 } }}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  // Styling to control padding, font-size, and width for a clean look
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    width: "100%",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                    // Adjust padding to vertically center the content now that the label is gone
                    paddingTop: "18.5px",
                    paddingBottom: "18.5px",
                  },
                }}
              >
                <Select
                  name="patent_status"
                  value={formData.patent_status}
                  onChange={handleChange}
                  displayEmpty
                  // The renderValue prop creates the custom placeholder
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
                  {/* This MenuItem corresponds to the empty state */}
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
            </Grid>

            {/* Documents Section */}
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
                {/* Current Document Display */}
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
                                  handleExistingDocDisplayNameChange(
                                    0,
                                    e.target.value
                                  )
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
                                    "& fieldset": {
                                      borderColor: "divider",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "primary.main",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderWidth: "2px",
                                    },
                                  },
                                }}
                                error={
                                  !!errors[`existing_document_display_name_0`]
                                }
                                helperText={
                                  errors[`existing_document_display_name_0`]
                                }
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
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  📎{" "}
                                  {existingDocuments[0].file_location
                                    .split("/")
                                    .pop()}
                                </Link>
                              ) : (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.disabled",
                                    fontStyle: "italic",
                                  }}
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
                                  "& .MuiSvgIcon-root": {
                                    color: "white",
                                  },
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

                {/* New Document Upload Section */}
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
                            newDocuments.length > 0
                              ? newDocuments[0].display_name
                              : ""
                          }
                          onChange={(e) => {
                            if (newDocuments.length === 0) {
                              addNewDocumentSlot();
                            }
                            handleNewDocumentDisplayNameChange(0, e);
                          }}
                          placeholder="Enter document name"
                          InputLabelProps={{
                            shrink: true,
                            sx: { fontWeight: 500 },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                              backgroundColor: "background.paper",
                              fontSize: { xs: "0.875rem", sm: "0.9rem" },
                              height: { xs: "48px", sm: "56px" },
                              "& fieldset": {
                                borderColor: "divider",
                              },
                              "&:hover fieldset": {
                                borderColor: "primary.main",
                              },
                              "&.Mui-focused fieldset": {
                                borderWidth: "2px",
                              },
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

                {/* Status Messages */}
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
                      <Box
                        sx={{
                          fontSize: "1.2rem",
                          flexShrink: 0,
                        }}
                      >
                        ⚠️
                      </Box>
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
                    <Box
                      sx={{
                        fontSize: "1.2rem",
                        flexShrink: 0,
                      }}
                    >
                      ✅
                    </Box>
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

            {/* Additional Info & Questions Sections (similar to CreateStudy, but mapping formData) */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  mt: { xs: 2, sm: 3, md: 4 },
                  mb: 3,
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Additional Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                {formData.additional_info.map((item, index) => (
                  <Paper
                    key={`addinfo-${index}`}
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      mb: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "primary.light",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "3px",
                        height: "100%",
                        backgroundColor: "primary.main",
                        borderRadius: "2px 0 0 2px",
                        opacity: 0.7,
                      },
                    }}
                  >
                    <Grid
                      container
                      spacing={{ xs: 2, sm: 2.5 }}
                      alignItems="flex-start"
                    >
                      <Grid item xs={12} sm={5} lg={5}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          label={`Key ${index + 1}`}
                          name="key"
                          value={item.key}
                          onChange={(e) => handleAdditionalInfoChange(index, e)}
                          placeholder="Enter key name"
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              fontWeight: 500,
                              fontSize: { xs: "0.875rem", sm: "0.9rem" },
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                              backgroundColor: "grey.50",
                              fontSize: { xs: "0.875rem", sm: "0.9rem" },
                              height: { xs: "44px", sm: "48px" },
                              "& fieldset": {
                                borderColor: "divider",
                              },
                              "&:hover fieldset": {
                                borderColor: "primary.main",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "background.paper",
                                "& fieldset": {
                                  borderWidth: "2px",
                                },
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5} lg={6}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          label={`Value ${index + 1}`}
                          name="value"
                          value={item.value}
                          onChange={(e) => handleAdditionalInfoChange(index, e)}
                          placeholder="Enter value"
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              fontWeight: 500,
                              fontSize: { xs: "0.875rem", sm: "0.9rem" },
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                              backgroundColor: "grey.50",
                              fontSize: { xs: "0.875rem", sm: "0.9rem" },
                              height: { xs: "44px", sm: "48px" },
                              "& fieldset": {
                                borderColor: "divider",
                              },
                              "&:hover fieldset": {
                                borderColor: "primary.main",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "background.paper",
                                "& fieldset": {
                                  borderWidth: "2px",
                                },
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2} lg={1}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "flex-end", sm: "center" },
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <IconButton
                            onClick={() => removeAdditionalInfoField(index)}
                            color="error"
                            size="small"
                            sx={{
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              borderRadius: 1.5,
                              border: "1px solid",
                              borderColor: "error.light",
                              backgroundColor: "error.50",
                              "&:hover": {
                                backgroundColor: "error.light",
                                color: "white",
                                borderColor: "error.main",
                                transform: "scale(1.05)",
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <RemoveCircleOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Field counter indicator */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        opacity: 0.8,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Paper>
                ))}

                {/* Empty state when no additional info fields */}
                {formData.additional_info.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      mb: 2.5,
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                        fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      }}
                    >
                      No additional information fields added yet
                    </Typography>
                  </Paper>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  mb: 2,
                }}
              >
                <Button
                  startIcon={<AddCircleOutline />}
                  onClick={addAdditionalInfoField}
                  variant="outlined"
                  size="small"
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
                  Add Info Field
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  mt: { xs: 2, sm: 3, md: 4 },
                  mb: 3,
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Questions & Answers
              </Typography>

              <Box sx={{ mb: 3 }}>
                {formData.questions.map((qa, index) => (
                  <Paper
                    key={`qa-${index}`}
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      mb: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2.5,
                      backgroundColor: "background.paper",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "primary.light",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      },
                      // Accent bar on the left
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "4px",
                        height: "100%",
                        backgroundColor: "primary.main",
                        borderTopLeftRadius: "inherit",
                        borderBottomLeftRadius: "inherit",
                      },
                    }}
                  >
                    <Grid
                      container
                      spacing={{ xs: 2, sm: 2.5 }}
                      // Vertically align all items in the row perfectly
                      alignItems="center"
                    >
                      {/* Question Field */}
                      <Grid item xs={12} sm={6} md={5.5}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small" // 'small' size gives a height of ~40px, matching the button
                          label={`Question ${index + 1}`}
                          name="question"
                          value={qa.question}
                          onChange={(e) => handleQuestionChange(index, e)}
                          placeholder="Enter a question"
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px", // Consistent border radius
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                      </Grid>

                      {/* Answer Field */}
                      <Grid item xs={12} sm={6} md={5.5}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small" // 'small' size gives a height of ~40px, matching the button
                          label={`Answer ${index + 1}`}
                          name="answer"
                          value={qa.answer}
                          onChange={(e) => handleQuestionChange(index, e)}
                          placeholder="Enter the answer"
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px", // Consistent border radius
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                      </Grid>

                      {/* Delete Button */}
                      <Grid item xs={12} sm={12} md={1}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "flex-end", md: "center" },
                          }}
                        >
                          <IconButton
                            onClick={() => removeQuestionField(index)}
                            size="small"
                            title="Remove Question"
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%", // Makes it a perfect circle
                              color: "error.main",
                              backgroundColor: "error.lighter",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <RemoveCircleOutline sx={{ fontSize: "1.25rem" }} />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}

                {/* Empty state (no changes needed here) */}
                {formData.questions.length === 0 && (
                  <Paper /* ... existing empty state paper ... */>
                    <Typography /* ... existing empty state text ... */>
                      No questions and answers added yet
                    </Typography>
                  </Paper>
                )}
              </Box>

              {/* Add Question Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  mb: 2,
                }}
              >
                <Button
                  startIcon={<AddCircleOutline />}
                  onClick={addQuestionField}
                  variant="contained" // Using contained for a primary action button
                  size="small"
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
                  Add Question & Answer
                </Button>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isLoading || loadingAuth}
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
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EditStudy;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Backdrop,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";

import BasicInfoSection from "./BasicInfoSection";
import ClassificationSection from "./ClassificationSection";
import DocumentUploadSection from "./DocumentUploadSection";
import RelatedQuestions from "./RelatedQuestions";
import SubmissionStatus from "./SubmissionStatus";

const CreateStudy = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    brief_description: "",
    genres: [],
    documents: [],
    patent_status: "",
    questions: [],
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      navigate("/login", { state: { from: "/create-study" } });
    }
  }, [currentUser, loadingAuth, navigate]);

  const handleAnalyzeDocument = async (file) => {
    if (!file) {
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalysisError("");
    setApiError("");

    const analysisFormData = new FormData();
    analysisFormData.append("study_document", file);

    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(
        "http://localhost:5000/studies/analyze-document",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: analysisFormData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze document.");
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || "",
        abstract: data.abstract || "",
        brief_description: data.brief_description || "",
        genres: data.genres || [],
        questions: data.questions || [],
      }));
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisError(
        err.message || "An unexpected error occurred during analysis."
      );
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFormData({
      title: "",
      abstract: "",
      brief_description: "",
      genres: [],
      documents: [],
      patent_status: "",
      questions: [],
    });
    setErrors({});
    setApiError("");
    setAnalysisError("");
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const handleGenresChange = useCallback((event, newValue) => {
    setFormData((prev) => ({ ...prev, genres: newValue }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.abstract.trim()) newErrors.abstract = "Abstract is required.";
    if (!formData.brief_description.trim())
      newErrors.brief_description = "Brief description is required.";
    if (!uploadedFile) newErrors.document = "A document must be uploaded.";

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
    submissionFormData.append("genres", JSON.stringify(formData.genres));
    if (formData.patent_status)
      submissionFormData.append("patent_status", formData.patent_status);

    submissionFormData.append("questions", JSON.stringify(formData.questions));

    if (uploadedFile) {
      submissionFormData.append(
        "study_document_files",
        uploadedFile,
        uploadedFile.name
      );
      submissionFormData.append(
        "documents_metadata",
        JSON.stringify([{ display_name: uploadedFile.name }])
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
        throw new Error(responseData.message || `Error: ${response.status}`);
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

  const commonTextFieldProps = useCallback(
    (name, label, required = false, helperText = "") => ({
      fullWidth: true,
      variant: "outlined",
      margin: "normal",
      name,
      label,
      value: formData[name] || "",
      onChange: handleChange,
      required,
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
    }),
    [formData, errors, handleChange, theme]
  );

  if (loadingAuth) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
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
        paddingTop: { xs: "100px", md: "120px" },
        flexGrow: 1,
        minHeight: "100vh",
      }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
        }}
        open={isAnalyzing}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>
          Analyzing document, please wait... This may take a minute.
        </Typography>
      </Backdrop>

      <Container
        maxWidth="xl"
        sx={{ paddingLeft: { md: "70px" }, paddingRight: { md: "70px" } }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: "600",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              mb: 1,
            }}
          >
            Create Research Study
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#666", fontSize: "1.1rem", maxWidth: "1200px" }}
          >
            Upload a document to automatically populate your research study,
            then review and submit.
          </Typography>
        </Box>

        <DocumentUploadSection
          document={uploadedFile}
          onFileChange={handleAnalyzeDocument}
          onFileRemove={handleRemoveFile}
          error={analysisError || errors.document}
          isAnalyzing={isAnalyzing}
        />

        <Fade in={!!uploadedFile && !isAnalyzing}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3, width: "100%" }}
          >
            <BasicInfoSection
              formData={formData}
              errors={errors}
              commonTextFieldProps={commonTextFieldProps}
            />
            <ClassificationSection
              formData={formData}
              handleGenresChange={handleGenresChange}
              handleChange={handleChange}
            />
            <RelatedQuestions questions={formData.questions} />
            <SubmissionStatus
              isSubmitting={isSubmitting}
              loadingAuth={loadingAuth}
              apiError={apiError}
              successMessage={successMessage}
            />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CreateStudy;

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
  Button,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

import BulkDocumentUpload from "./BulkDocumentUpload";
import StudiesTable from "./StudiesTable";
import BulkStudyForm from "./BulkStudyForm";

const BulkCreateStudy = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();
  const theme = useTheme();

  const [studies, setStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      navigate("/login", { state: { from: "/bulk-create-study" } });
    }
  }, [currentUser, loadingAuth, navigate]);

  const handleFileChange = (files) => {
    const newStudies = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      status: "pending", // pending, analyzing, analyzed, error
      title: "",
      abstract: "",
      brief_description: "",
      genres: [],
      documents: [],
      patent_status: "",
      questions: [],
    }));
    setStudies(newStudies);
    handleAnalyzeDocuments(newStudies);
  };

  const handleAnalyzeDocuments = async (studiesToAnalyze) => {
    setIsAnalyzing(true);
    setApiError("");

    for (const study of studiesToAnalyze) {
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "analyzing" } : s))
      );
      const analysisFormData = new FormData();
      analysisFormData.append("study_document", study.file);

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

        setStudies((prev) =>
          prev.map((s) =>
            s.id === study.id
              ? {
                  ...s,
                  status: "analyzed",
                  title: data.title || "",
                  abstract: data.abstract || "",
                  brief_description: data.brief_description || "",
                  genres: data.genres || [],
                  questions: data.questions || [],
                }
              : s
          )
        );
      } catch (err) {
        console.error("Analysis failed:", err);
        setStudies((prev) =>
          prev.map((s) => (s.id === study.id ? { ...s, status: "error" } : s))
        );
      }
    }
    setIsAnalyzing(false);
  };

  const handleSelectStudy = (studyId) => {
    setSelectedStudyId(studyId);
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setStudies((prev) =>
        prev.map((study) =>
          study.id === selectedStudyId ? { ...study, [name]: value } : study
        )
      );
    },
    [selectedStudyId]
  );

  const handleGenresChange = useCallback(
    (event, newValue) => {
      setStudies((prev) =>
        prev.map((study) =>
          study.id === selectedStudyId ? { ...study, genres: newValue } : study
        )
      );
    },
    [selectedStudyId]
  );

  // NEW: handleArrayItemChange function to update items in arrays
  const handleArrayItemChange = useCallback(
    (arrayName, index, e) => {
      const { name, value } = e.target;
      setStudies((prevStudies) =>
        prevStudies.map((study) => {
          if (study.id === selectedStudyId) {
            const updatedArray = [...study[arrayName]];
            updatedArray[index] = { ...updatedArray[index], [name]: value };
            return { ...study, [arrayName]: updatedArray };
          }
          return study;
        })
      );
    },
    [selectedStudyId]
  );

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    for (const study of studies) {
      if (study.status !== "analyzed") continue; // Only submit analyzed studies

      const submissionFormData = new FormData();
      submissionFormData.append("title", study.title.trim());
      submissionFormData.append("abstract", study.abstract.trim());
      submissionFormData.append(
        "brief_description",
        study.brief_description.trim()
      );
      submissionFormData.append("genres", JSON.stringify(study.genres));
      if (study.patent_status)
        submissionFormData.append("patent_status", study.patent_status);

      submissionFormData.append("questions", JSON.stringify(study.questions));
      submissionFormData.append(
        "study_document_files",
        study.file,
        study.file.name
      );
      submissionFormData.append(
        "documents_metadata",
        JSON.stringify([{ display_name: study.file.name }])
      );

      try {
        const token = await currentUser.getIdToken(true);
        const response = await fetch("http://localhost:5000/studies", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: submissionFormData,
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || `Error creating study: ${study.title}`
          );
        }
      } catch (error) {
        setApiError(
          (prev) =>
            `${prev}\nFailed to create study "${study.title}": ${error.message}`
        );
      }
    }

    setIsSubmitting(false);
    if (!apiError) {
      setSuccessMessage(
        "All analyzed studies have been created successfully! Redirecting..."
      );
      setTimeout(() => navigate("/dashboard"), 3000);
    }
  };

  const commonTextFieldProps = useCallback(
    (name, label, required = false, helperText = "") => ({
      fullWidth: true,
      variant: "outlined",
      margin: "normal",
      name,
      label,
      value: studies.find((s) => s.id === selectedStudyId)?.[name] || "",
      onChange: handleChange,
      required,
      error: !!errors[name],
      helperText: errors[name] || helperText,
      InputLabelProps: { shrink: true },
    }),
    [studies, errors, handleChange, selectedStudyId]
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

  const selectedStudy = studies.find((s) => s.id === selectedStudyId);

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: { opacity: 0, y: 10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -10 },
      }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
      sx={{
        backgroundColor: "#F9FAFB",
        paddingTop: { xs: "100px", sm: "120px" },
        flexGrow: 1,
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
          Analyzing documents... This may take a while.
        </Typography>
      </Backdrop>

      <Container
        maxWidth="xl"
        sx={{ py: 0, px: { xs: "26px", sm: "32px", md: "70px" } }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "600", mb: 1 }}
          >
            Bulk Create Research Studies
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Upload multiple documents to create several studies at once.
          </Typography>
        </Box>

        <BulkDocumentUpload
          onFilesChange={handleFileChange}
          isAnalyzing={isAnalyzing}
        />

        {studies.length > 0 && (
          <Fade in={true}>
            <Box>
              <StudiesTable
                studies={studies}
                onSelectStudy={handleSelectStudy}
                selectedStudyId={selectedStudyId}
              />
              {selectedStudy && (
                <BulkStudyForm
                  formData={selectedStudy}
                  errors={errors}
                  commonTextFieldProps={commonTextFieldProps}
                  handleChange={handleChange}
                  handleGenresChange={handleGenresChange}
                  handleArrayItemChange={handleArrayItemChange}
                />
              )}
              <Box sx={{ mt: 4, textAlign: "center", mb: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmitAll}
                  disabled={isSubmitting || isAnalyzing}
                  type="submit"
                  color="primary"
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
                    <CircularProgress size={24} />
                  ) : (
                    "Create All Studies"
                  )}
                </Button>
                {apiError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {apiError}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                  </Alert>
                )}
              </Box>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default BulkCreateStudy;

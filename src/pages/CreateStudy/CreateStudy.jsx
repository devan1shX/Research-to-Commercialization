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

  const initialDocumentState = { file: null, display_name: "" };
  const initialQuestionState = { question: "", answer: "" };

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

  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      navigate("/login", { state: { from: "/create-study" } });
    }
  }, [currentUser, loadingAuth, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleGenresChange = useCallback((event, newValue) => {
    setFormData((prev) => ({ ...prev, genres: newValue }));
  }, []);

  const handleArrayItemChange = useCallback((arrayName, index, event) => {
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
  }, [errors]);

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
  }, []);

  const handleDocumentFileChange = useCallback((index, event) => {
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
  }, [errors]);

  const handleDocumentDisplayNameChange = useCallback((index, event) => {
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
  }, [errors]);

  const addDocumentField = useCallback(() => {
    if (formData.documents.length < 5) {
      addArrayItem("documents", initialDocumentState);
    }
  }, [addArrayItem, formData.documents.length]);

  const removeSelectedFile = useCallback((docIndex) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === docIndex ? { ...doc, file: null } : doc
      ),
    }));
  }, []);

  const validatePairedFields = (items, keyField, valueField, errorKeyPrefix, currentErrors, itemLabelSingular) => {
    items.forEach((item, index) => {
      const keyTrimmed = String(item[keyField] || "").trim();
      const valueTrimmed = String(item[valueField] || "").trim();
      if (keyTrimmed || valueTrimmed) {
        if (!keyTrimmed) currentErrors[`${errorKeyPrefix}_${keyField}_${index}`] = `${keyField.charAt(0).toUpperCase() + keyField.slice(1)} for ${itemLabelSingular} ${index + 1} is required.`;
        if (!valueTrimmed) currentErrors[`${errorKeyPrefix}_${valueField}_${index}`] = `${valueField.charAt(0).toUpperCase() + valueField.slice(1)} for ${itemLabelSingular} ${index + 1} is required.`;
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.abstract.trim()) newErrors.abstract = "Abstract is required.";
    if (!formData.brief_description.trim()) newErrors.brief_description = "Brief description is required.";

    formData.documents.forEach((doc, index) => {
      if (doc.file && !String(doc.display_name || "").trim()) {
        newErrors[`document_display_name_${index}`] = `Display name for document ${index + 1} is required.`;
      }
      if (String(doc.display_name || "").trim() && !doc.file) {
        newErrors[`document_file_${index}`] = `File for document ${index + 1} is required.`;
      }
    });

    validatePairedFields(formData.questions, "question", "answer", "question", newErrors, "question");
    
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
    submissionFormData.append("brief_description", formData.brief_description.trim());

    if (formData.genres.length > 0) {
      submissionFormData.append("genres", JSON.stringify(formData.genres));
    }
    if (formData.patent_status) {
      submissionFormData.append("patent_status", formData.patent_status);
    }

    const documentsMetadata = [];
    formData.documents.forEach((doc) => {
      if (doc.file && doc.display_name.trim()) {
        submissionFormData.append("study_document_files", doc.file, doc.file.name);
        documentsMetadata.push({ display_name: doc.display_name.trim() });
      }
    });
    if (documentsMetadata.length > 0) {
      submissionFormData.append("documents_metadata", JSON.stringify(documentsMetadata));
    }

    const filteredQuestions = formData.questions.filter(
      (qa) => qa.question.trim() && qa.answer.trim()
    );
    if (filteredQuestions.length > 0) {
      submissionFormData.append("questions", JSON.stringify(filteredQuestions));
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
          errorMessage = responseData.message || "Validation failed. Please check the fields.";
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
  
  const commonTextFieldProps = useCallback((name, label, required = false, helperText = "") => ({
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
  }), [formData, errors, handleChange, theme]);


  if (loadingAuth) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      }}
    >
      <Container maxWidth="xl" sx={{ paddingLeft: { md: "70px" }, paddingRight: { md: "70px" } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: "600", fontSize: { xs: "1.8rem", md: "2.5rem" }, mb: 1 }}>
            Create Research Study
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", fontSize: "1.1rem", maxWidth: "1200px" }}>
            Share your research with the scientific community and collaborate with fellow researchers
          </Typography>
        </Box>

        <DocumentUploadSection
          documents={formData.documents}
          errors={errors}
          addDocumentField={addDocumentField}
          handleDocumentDisplayNameChange={handleDocumentDisplayNameChange}
          handleDocumentFileChange={handleDocumentFileChange}
          removeSelectedFile={removeSelectedFile}
        />
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: "100%" }}>
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
          <RelatedQuestions
            questions={formData.questions}
            errors={errors}
            handleArrayItemChange={handleArrayItemChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
          <SubmissionStatus
            isSubmitting={isSubmitting}
            loadingAuth={loadingAuth}
            apiError={apiError}
            successMessage={successMessage}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default CreateStudy;
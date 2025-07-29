import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

import { suggestedGenres, patentStatuses } from "./constants";
import StudyInfoFields from "./StudyInfoFields";
import DocumentManager from "./DocumentManager";
import AdditionalInfoFields from "./AdditionalInfoFields";
import RelatedQuestions from "./RelatedQuestions";

const EditStudy = () => {
  const { id: studyId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    brief_description: "",
    genres: [],
    patent_status: "",
    questions: [],
    additional_info: [],
  });

  const [existingDocuments, setExistingDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [initialResearcherId, setInitialResearcherId] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialAdditionalInfoState = { key: "", value: "" };
  const initialNewDocumentState = { file: null, display_name: "" };

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
      const response = await fetch(`/api/my-studies/${studyId}`, {
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
          ? data.questions.map((q, index) => ({
              id: `initial-question-${index}`,
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

  const handleQuestionChange = (id, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((qa) =>
        qa.id === id ? { ...qa, [name]: value } : qa
      ),
    }));
  };
  
  const addQuestionField = () =>
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: `new-question-${Date.now()}`, question: "", answer: "" },
      ],
    }));

  const removeQuestionField = (id) =>
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((qa) => qa.id !== id),
    }));

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

    const filteredQuestions = formData.questions
      .filter((qa) => qa.question.trim() && qa.answer.trim())
      .map(({ question, answer }) => ({ question, answer }));

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

    const keptExistingDocuments = existingDocuments
      .filter((doc) => doc.status === "keep")
      .map((doc) => ({
        display_name: doc.display_name,
        file_location: doc.file_location,
        _id: doc._id,
      }));
    submissionFormData.append(
      "kept_documents_metadata",
      JSON.stringify(keptExistingDocuments)
    );

    const deletedDocumentLocations = existingDocuments
      .filter((doc) => doc.status === "delete")
      .map((doc) => doc.file_location);
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
        );
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
      const response = await fetch(`/api/studies/${studyId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
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
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          You are not authorized to view this page or the study does not
          exist.
        </Alert>
      </Container>
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
            Update your research to share with the scientific community and
            collaborate.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: { xs: 3, sm: 3, md: 3 },
              width: "100%",
              maxWidth: "none",
            }}
          >
            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <StudyInfoFields
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleGenresChange={handleGenresChange}
              suggestedGenres={suggestedGenres}
              patentStatuses={patentStatuses}
            />

            {/* <DocumentManager
              existingDocuments={existingDocuments}
              newDocuments={newDocuments}
              errors={errors}
              apiError={apiError}
              setApiError={setApiError}
              toggleDeleteExistingDocument={toggleDeleteExistingDocument}
              handleExistingDocDisplayNameChange={
                handleExistingDocDisplayNameChange
              }
              handleNewDocumentFileChange={handleNewDocumentFileChange}
              handleNewDocumentDisplayNameChange={
                handleNewDocumentDisplayNameChange
              }
              addNewDocumentSlot={addNewDocumentSlot}
              removeSelectedNewFile={removeSelectedNewFile}
            /> */}

            {/* <AdditionalInfoFields
              additionalInfo={formData.additional_info}
              handleAdditionalInfoChange={handleAdditionalInfoChange}
              addAdditionalInfoField={addAdditionalInfoField}
              removeAdditionalInfoField={removeAdditionalInfoField}
            /> */}

            <RelatedQuestions
              questions={formData.questions}
              handleQuestionChange={handleQuestionChange}
              addQuestionField={addQuestionField}
              removeQuestionField={removeQuestionField}
            />

            <Grid item xs={12} sx={{ mt: 3, textAlign: "center" }}>
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

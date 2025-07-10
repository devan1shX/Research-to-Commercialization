import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import StudyCard from "../../components/StudyCard";
import { useAuth } from "../../AuthContext";

const ITEMS_PER_PAGE = 6;

const commonButtonSx = {
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
  boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)",
};

const Dashboard = () => {
  const [myStudiesResponse, setMyStudiesResponse] = useState({
    studies: [],
    totalPages: 1,
    currentPage: 1,
    totalStudies: 0,
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const handleNavigateToBulkCreate = () => navigate("/bulk-create-study");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchStudiesForPage = useCallback(
    async (page) => {
      if (!currentUser) {
        setError("User not authenticated. Cannot fetch studies.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken(true);
        if (!token) throw new Error("Failed to retrieve authentication token.");

        const params = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });

        if (debouncedSearchQuery) {
          params.append("title", debouncedSearchQuery);
        }
        selectedGenres.forEach((genreValue) => {
          params.append("genre", genreValue);
        });

        const response = await fetch(
          `http://localhost:5000/api/my-studies?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({
            message: `HTTP error! Status: ${response.status}`,
          }));
          throw new Error(
            errData.message || `HTTP error! Status: ${response.status}`
          );
        }
        const data = await response.json();
        setMyStudiesResponse({
          studies: Array.isArray(data.studies) ? data.studies : [],
          totalPages: data.totalPages || 0,
          currentPage: data.currentPage || page,
          totalStudies: data.totalStudies || 0,
        });
        if (data.currentPage && data.currentPage !== page) {
          setCurrentPage(data.currentPage);
        }
      } catch (e) {
        console.error("Failed to fetch my studies:", e);
        setError(e.message);
        setMyStudiesResponse({
          studies: [],
          totalPages: 1,
          currentPage: 1,
          totalStudies: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [currentUser, debouncedSearchQuery, selectedGenres]
  );

  useEffect(() => {
    if (currentUser) {
      fetchStudiesForPage(currentPage);
    } else {
      if (currentUser === null) {
        setError("User not authenticated. Please log in to view your studies.");
        setLoading(false);
      }
    }
  }, [currentPage, currentUser, fetchStudiesForPage]);

  const handleOpenDeleteDialog = (studyId) => {
    setStudyToDelete(studyId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setStudyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !studyToDelete) {
      setError("User not authenticated or no study selected for deletion.");
      handleCloseDeleteDialog();
      return;
    }

    setLoading(true);
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(
        `http://localhost:5000/studies/${studyToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete study");
      }

      if (myStudiesResponse.studies.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchStudiesForPage(currentPage);
      }
    } catch (delError) {
      console.error("Delete error:", delError);
      setError(delError.message);
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleNextPage = () => {
    if (currentPage < myStudiesResponse.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleAddNewStudy = () => navigate("/create-study");
  const handleEditStudy = (studyId) => navigate(`/edit-study/${studyId}`);

  const handleNavigateToStudy = (studyId) => navigate(`/my-study/${studyId}`);

  const handleGenreChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading && myStudiesResponse.studies.length === 0 && !error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          paddingTop: { xs: "100px", sm: "120px", md: "120px" },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const isAuthError =
      error.includes("User not authenticated") ||
      error.includes("Failed to retrieve authentication token.") ||
      error.includes("Authentication token not found");
    return (
      <Box
        sx={{
          paddingTop: { xs: "100px", sm: "120px", md: "120px" },
          textAlign: "center",
          flexGrow: 1,
          pb: { xs: 4, sm: 5, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 120px)",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Typography color="error" variant="h6">
          Failed to load your studies
        </Typography>
        <Typography sx={{ mt: 1 }}>{error}</Typography>
        {isAuthError ? (
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => fetchStudiesForPage(currentPage)}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        )}
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Please ensure the backend server is running and you are logged in.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
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
        <Box sx={{ mb: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: "600",
                color: "#1a1a1a",
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Manage Your Studies
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                onClick={handleAddNewStudy}
                startIcon={<AddIcon />}
                sx={{ ...commonButtonSx, flexGrow: 1 }}
              >
                Add New
              </Button>
              <Button
                variant="outlined"
                onClick={handleNavigateToBulkCreate}
                startIcon={<CloudUploadIcon />}
                sx={{
                  ...commonButtonSx,
                  flexGrow: 1,
                  bgcolor: "white",
                  color: "#2563eb",
                  border: "1px solid #2563eb",
                  "&:hover": {
                    bgcolor: "rgba(37, 99, 235, 0.04)",
                    border: "1px solid #1d4ed8",
                  },
                }}
              >
                Bulk Upload
              </Button>
            </Stack>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "1.1rem",
              maxWidth: "1200px",
              mt: 1,
            }}
          >
            View, create, edit, and manage your research studies.
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 4,
            pb: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading && myStudiesResponse.studies.length > 0 && (
            <CircularProgress sx={{ alignSelf: "center", mb: 2 }} />
          )}

          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 3, width: "100%" }}
          >
            {myStudiesResponse.studies.map((study) => (
              <StudyCard
                key={study._id}
                study={study}
                onEdit={handleEditStudy}
                onDelete={handleOpenDeleteDialog}
                onNavigate={handleNavigateToStudy}
              />
            ))}
          </Box>

          {!loading && myStudiesResponse.studies.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#9CA3AF",
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No studies found
              </Typography>
              <Typography variant="body2">
                {searchQuery || selectedGenres.length > 0
                  ? "Try adjusting your search criteria or filters."
                  : "You haven't added any studies yet, or no studies match the current filters."}
              </Typography>
            </Box>
          )}

          {!loading &&
            myStudiesResponse.studies.length > 0 &&
            myStudiesResponse.totalPages > 1 && <Box sx={{ flexGrow: 1 }} />}

          {!loading &&
            myStudiesResponse.studies.length > 0 &&
            myStudiesResponse.totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: { xs: 3, sm: 4 },
                  gap: { xs: 1, sm: 1.5 },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  sx={{
                    minWidth: { xs: "38px", sm: "40px" },
                    height: { xs: "38px", sm: "40px" },
                    padding: "0",
                    borderRadius: "8px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color: currentPage === 1 ? "rgba(0, 0, 0, 0.26)" : "black",
                    backgroundColor: "white",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": { backgroundColor: "#F4F4F5" },
                    "&.Mui-disabled": {
                      borderColor: "rgba(0, 0, 0, 0.12)",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      boxShadow: "none",
                    },
                  }}
                  aria-label="Previous page"
                >
                  <ArrowBackIosNewIcon
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  />
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontFamily:
                      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    fontWeight: 500,
                    mx: 1,
                  }}
                >
                  Page {currentPage} of {myStudiesResponse.totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === myStudiesResponse.totalPages}
                  sx={{
                    minWidth: { xs: "38px", sm: "40px" },
                    height: { xs: "38px", sm: "40px" },
                    padding: "0",
                    borderRadius: "8px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color:
                      currentPage === myStudiesResponse.totalPages
                        ? "rgba(0, 0, 0, 0.26)"
                        : "black",
                    backgroundColor: "white",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": { backgroundColor: "#F4F4F5" },
                    "&.Mui-disabled": {
                      borderColor: "rgba(0, 0, 0, 0.12)",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      boxShadow: "none",
                    },
                  }}
                  aria-label="Next page"
                >
                  <ArrowForwardIosIcon
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  />
                </Button>
              </Box>
            )}
        </Box>
      </Container>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this study? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;

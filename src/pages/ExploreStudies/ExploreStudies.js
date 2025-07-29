import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchBar from "../../components/SearchBar";
import FieldSelector from "../../components/FieldSelector";
import ActiveFilters from "../../components/ActiveFilters";
import ResearchCard from "../../components/ResearchCard";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 6;

const ExploreStudies = () => {
  const [studiesResponse, setStudiesResponse] = useState({
    studies: [],
    totalStudies: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const allAvailableGenresForSelector = [
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Energy", label: "Energy" },
    { value: "Medical Research", label: "Medical Research" },
    { value: "Physics", label: "Physics" },
    { value: "API Test", label: "API Test" },
    { value: "Software Development", label: "Software Development" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Postman", label: "Postman" },
    { value: "API", label: "API" },
  ];

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.append("title", debouncedSearchQuery);
    }
    selectedGenres.forEach((genreValue) => {
      params.append("genre", genreValue);
    });
    params.append("page", currentPage.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());

    try {
      const response = await fetch(
        `http://r2c.iiitd.edu.in/studies?${params.toString()}`
      );
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setStudiesResponse({
        studies: Array.isArray(data.studies) ? data.studies : [],
        totalStudies: data.totalStudies || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.currentPage || 1,
      });
    } catch (e) {
      console.error("Failed to fetch studies:", e);
      setError(e.message);
      setStudiesResponse({
        studies: [],
        totalStudies: 0,
        totalPages: 1,
        currentPage: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedGenres, currentPage]);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

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

  const handleRemoveSelectedGenre = (genreToRemove) => {
    setSelectedGenres((prev) =>
      prev.filter((genre) => genre !== genreToRemove)
    );
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearAllGenres = () => {
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  const handleCardClick = (study) => {
    navigate(`/study/${study._id}`);
  };

  const handleNextPage = () => {
    if (currentPage < studiesResponse.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const fieldSelectorEffectiveSx = {
    width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
  };

  if (loading && studiesResponse.studies.length === 0) {
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
    return (
      <Box
        sx={{
          paddingTop: { xs: "100px", sm: "120px", md: "120px" },
          textAlign: "center",
          flexGrow: 1,
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Typography color="error" variant="h6">
          Failed to load studies
        </Typography>
        <Typography sx={{ mt: 1 }}>{error}</Typography>
        <Typography sx={{ mt: 2 }}>
          Please ensure the backend server is running and accessible.
        </Typography>
      </Box>
    );
  }

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
            Explore Research Studies
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
            Discover cutting-edge research opportunities across various fields
            of technology and innovation.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            mb: 2,
          }}
        >
          <FieldSelector
            selectedFields={selectedGenres}
            onFieldChange={handleGenreChange}
            fields={allAvailableGenresForSelector}
            sx={fieldSelectorEffectiveSx}
          />
          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Search studies by title..."
            />
          </Box>
        </Box>

        <ActiveFilters
          selectedFields={selectedGenres}
          searchQuery={searchQuery}
          onClearField={handleRemoveSelectedGenre}
          onClearSearch={handleClearSearch}
          fields={allAvailableGenresForSelector}
        />

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
          {loading && studiesResponse.studies.length > 0 && (
            <CircularProgress sx={{ alignSelf: "center", mb: 2 }} />
          )}

          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 3, width: "100%" }}
          >
            {studiesResponse.studies.map((study) => (
              <ResearchCard
                key={study._id}
                study={study}
                onClick={() => handleCardClick(study)}
              />
            ))}
          </Box>

          {!loading && studiesResponse.studies.length === 0 && (
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
                Try adjusting your search criteria or filters.
              </Typography>
            </Box>
          )}

          {!loading &&
            studiesResponse.studies.length > 0 &&
            studiesResponse.totalPages > 1 && <Box sx={{ flexGrow: 1 }} />}

          {!loading &&
            studiesResponse.studies.length > 0 &&
            studiesResponse.totalPages > 1 && (
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
                  Page {currentPage} of {studiesResponse.totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === studiesResponse.totalPages}
                  sx={{
                    minWidth: { xs: "38px", sm: "40px" },
                    height: { xs: "38px", sm: "40px" },
                    padding: "0",
                    borderRadius: "8px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color:
                      currentPage === studiesResponse.totalPages
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
    </Box>
  );
};

export default ExploreStudies;

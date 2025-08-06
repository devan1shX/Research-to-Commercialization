import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
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
  const [selectedDateRange, setSelectedDateRange] = useState("");
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

  const dateRangeOptions = [
    { value: "", label: "Any Time (Clear Filter)" },
    { value: "last-7-days", label: "Last 7 days" },
    { value: "last-30-days", label: "Last 30 days" },
    { value: "last-6-months", label: "Last 6 months" },
    { value: "last-year", label: "Last year" },
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
    if (selectedDateRange) {
      params.append("dateRange", selectedDateRange);
    }
    params.append("page", currentPage.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());

    try {
      const response = await fetch(
        `/api/studies?${params.toString()}`
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
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedGenres, selectedDateRange, currentPage]);

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

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
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

  const handleClearDateRange = () => {
    setSelectedDateRange("");
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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

  const filterSelectorSx = {
    width: { xs: "100%", md: "calc(33.333% - 16px)" },
    flexShrink: 0,
  };

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

  const renderContent = () => {
    if (loading && studiesResponse.studies.length === 0 && !error) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: "center", py: 8, flexGrow: 1 }}>
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

    if (!loading && studiesResponse.studies.length === 0) {
      return (
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
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No studies found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search criteria or filters.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            width: "100%",
            flexGrow: 1,
            transition: "opacity 0.2s ease-in-out",
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          {studiesResponse.studies.map((study) => (
            <ResearchCard
              key={study._id}
              study={study}
              onClick={() => handleCardClick(study)}
            />
          ))}
        </Box>

        {studiesResponse.totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 3, sm: 4 },
              gap: { xs: 1, sm: 1.5 },
              visibility: loading ? "hidden" : "visible",
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
      </>
    );
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
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "wrap",
            width: "100%",
            mb: 2,
          }}
        >
          {/* <FieldSelector
            selectedFields={selectedGenres}
            onFieldChange={handleGenreChange}
            fields={allAvailableGenresForSelector}
            sx={filterSelectorSx}
          /> */}

          <FormControl
            variant="outlined"
            sx={{
              ...filterSelectorSx,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
                transition:
                  "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, height 0.2s ease-in-out",
                "& .MuiOutlinedInput-notchedOutline": {
                  transition:
                    "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563EB",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2563EB",
                    borderWidth: "2px",
                  },
                },
              },
            }}
          >
            <Select
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              displayEmpty
              inputProps={{ "aria-label": "Filter by Date" }}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography
                      component="em"
                      sx={{
                        color: "#757575",
                        fontFamily:
                          '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: "0.95rem",
                        fontStyle: "italic",
                      }}
                    >
                      Filter by Date
                    </Typography>
                  );
                }
                const option = dateRangeOptions.find(
                  (opt) => opt.value === selected
                );
                return (
                  <Typography
                    sx={{
                      fontFamily:
                        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                  >
                    {option ? option.label : ""}
                  </Typography>
                );
              }}
              sx={{
                borderRadius: "12px",
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: "0.95rem",
                "& .MuiSelect-icon": {
                  color: "#666",
                },
              }}
            >
              {dateRangeOptions.map((option) => (
                <MenuItem
                  key={option.value || "all-time"}
                  value={option.value}
                  sx={{
                    fontFamily:
                      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: "0.95rem",
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              flex: 1,
              width: "100%",
              minWidth: { xs: "100%", md: "300px" },
            }}
          >
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Search by title or genre..."
            />
          </Box>
        </Box>

        {/* <ActiveFilters
          selectedFields={selectedGenres}
          searchQuery={searchQuery}
          selectedDateRange={selectedDateRange}
          onClearField={handleRemoveSelectedGenre}
          onClearSearch={handleClearSearch}
          onClearDateRange={handleClearDateRange}
          fields={allAvailableGenresForSelector}
          dateRangeOptions={dateRangeOptions}
        /> */}

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
          {renderContent()}
        </Box>
      </Container>
    </Box>
  );
};

export default ExploreStudies;

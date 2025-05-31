import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchBar from '../../components/SearchBar';
import FieldSelector from '../../components/FieldSelector';
import ActiveFilters from '../../components/ActiveFilters';
import ResearchCard from '../../components/ResearchCard';

const ITEMS_PER_PAGE = 6;

const ExploreStudies = () => {
  const [allStudies, setAllStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFields, setSelectedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/studies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllStudies(data);
      } catch (e) {
        console.error("Failed to fetch studies:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  const allFields = [
    { value: 'all', label: 'All Fields' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'energy', label: 'Energy' },
    { value: 'medical-research', label: 'Medical Research' },
    { value: 'physics', label: 'Physics' },
    { value: 'computer-science', label: 'Computer Science' }
  ];

  const selectableFields = allFields.filter(field => field.value !== 'all');

  const handleFieldChange = (event) => {
    const { target: { value } } = event;
    setSelectedFields(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRemoveSelectedField = (fieldToRemove) => {
    setSelectedFields((prev) => prev.filter((field) => field !== fieldToRemove));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearAllFields = () => {
    setSelectedFields([]);
  };

  const handleCardClick = (study) => {
    navigate(`/study/${study.id}`);
  };

  const filteredData = allStudies.filter(study => {
    const matchesSearch = searchQuery === '' ||
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFields = selectedFields.length === 0 || selectedFields.some(selectedValue => {
      const fieldObject = allFields.find(f => f.value === selectedValue);
      return fieldObject && study.category && study.category.toLowerCase() === fieldObject.label.toLowerCase();
    });
    return matchesSearch && matchesFields;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFields]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const fieldSelectorEffectiveSx = {
    width: {
      xs: '100%',
      sm: 'calc(50% - 12px)',
      md: 'calc(33.333% - 16px)',
      lg: 'calc(33.333% - 16px)',
      xl: 'calc(33.333% - 16px)',
    },
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexGrow: 1, 
        paddingTop: { xs: '100px', sm: '120px', md: '120px' },
        pb: { xs: 4, sm: 5, md: 6 }
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        paddingTop: { xs: '100px', sm: '120px', md: '120px' }, 
        textAlign: 'center', 
        flexGrow: 1, 
        pb: { xs: 4, sm: 5, md: 6 }
      }}>
        <Typography color="error">Failed to load studies: {error}</Typography>
        <Typography>Please ensure the backend server is running on port 5000.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: '#F9FAFB',
      paddingTop: { xs: '100px', sm: '120px', md: '120px' },
      flexGrow: 1, 
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0, 
    }}>
      <Container
        maxWidth="xl"
        sx={{
          py: 0,
          paddingLeft: { xs: '26px', sm: '32px', md: '70px' },
          paddingRight: { xs: '26px', sm: '32px', md: '70px' },
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            component="h6"
            sx={{
              fontWeight: '600',
              color: '#1a1a1a',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Explore Research Studies
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1.1rem',
              maxWidth: '1200px',
            }}
          >
            Discover cutting-edge research opportunities across various fields of technology and innovation.
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
        }}>
          <FieldSelector
            selectedFields={selectedFields}
            onFieldChange={handleFieldChange}
            fields={selectableFields}
            sx={fieldSelectorEffectiveSx}
          />
          <Box sx={{
            flex: 1,
            width: '100%',
            minWidth: 0,
          }}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Search studies by title or description..."
            />
          </Box>
        </Box>

        <ActiveFilters
          selectedFields={selectedFields}
          searchQuery={searchQuery}
          onClearField={handleRemoveSelectedField}
          onClearSearch={handleClearSearch}
          onClearAllFields={handleClearAllFields}
          fields={allFields}
        />

        <Box sx={{
          mt: 4,
          pb: { xs: 4, sm: 5, md: 6 },
          width: '100%',
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              width: '100%',
            }}
          >
            {paginatedData.map((study) => (
              <ResearchCard
                key={study.id}
                study={study}
                onClick={() => handleCardClick(study)}
              />
            ))}
          </Box>

          {!loading && filteredData.length === 0 && (
            <Box sx={{
              textAlign: 'center',
              py: 8,
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#9CA3AF',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No studies found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search criteria or filters.
              </Typography>
            </Box>
          )}
          
          {!loading && filteredData.length > 0 && totalPages > 1 && (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {!loading && filteredData.length > 0 && totalPages > 1 && (
            <Box
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: { xs: 3, sm: 4 },
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                sx={{
                  minWidth: { xs: '38px', sm: '40px' },
                  height: { xs: '38px', sm: '40px' },
                  padding: '0',
                  borderRadius: '8px',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: currentPage === 1 ? 'rgba(0, 0, 0, 0.26)' : 'black',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: '#F4F4F5',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    boxShadow:'none',
                  }
                }}
                aria-label="Previous page"
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: '#374151',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 500,
                  mx:1
                }}
              >
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                sx={{
                  minWidth: { xs: '38px', sm: '40px' },
                  height: { xs: '38px', sm: '40px' },
                  padding: '0',
                  borderRadius: '8px',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: currentPage === totalPages ? 'rgba(0, 0, 0, 0.26)' : 'black',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: '#F4F4F5',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    boxShadow:'none',
                  }
                }}
                aria-label="Next page"
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ExploreStudies;

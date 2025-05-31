import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';

const ResearchCard = ({ study, onClick }) => {
  return (
    <Box
      sx={{
        flex: {
          xs: '1 1 100%',
          sm: '1 1 calc(50% - 12px)',
          md: '1 1 calc(33.333% - 16px)',
          lg: '1 1 calc(33.333% - 16px)',
          xl: '1 1 calc(33.333% - 16px)',
        },
        minWidth: {
          xs: '100%',
          sm: 'calc(50% - 12px)',
          md: 'calc(33.333% - 16px)',
          lg: 'calc(33.333% - 16px)',
          xl: 'calc(33.333% - 16px)',
        },
        maxWidth: {
          xs: '100%',
          sm: 'calc(50% - 12px)',
          md: 'calc(33.333% - 16px)',
          lg: 'calc(33.333% - 16px)',
          xl: 'calc(33.333% - 16px)',
        },
      }}
    >
      <Card
        onClick={() => onClick && onClick(study)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: '300px',
          maxWidth: '100%',
          
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            '&:last-child': {
              paddingBottom: 3,
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Chip
              label={study.category}
              size="small"
              sx={{
                backgroundColor: '#DBEAFE',
                color: '#1E40AF',
                fontWeight: '500',
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          </Box>
          
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: '600',
              color: '#1a1a1a',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1.1rem',
              mb: 2,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              "&:hover":{
                color:"#2563EB"
              }
            }}
          >
            {study.title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {study.description}
          </Typography>
          
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #F3F4F6' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#2563EB',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.95rem',
                fontWeight: '500',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Learn More
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResearchCard;
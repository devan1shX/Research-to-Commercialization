import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1f2e',
        color: '#9ca3af',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 4,
            },
          }}
        >
          {/* Brand Section - Start */}
          <Box sx={{ flex: '1', maxWidth: '400px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookIcon 
                sx={{ 
                  color: '#3b82f6', 
                  fontSize: 32, 
                  mr: 1 
                }} 
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                }}
              >
                Research to Commercialization
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#9ca3af',
                lineHeight: 1.6,
              }}
            >
              R2C.ai bridges the gap between academic innovation and industry needs—through AI-driven classification, matchmaking, and secure collaboration.
            </Typography>
          </Box>

          {/* Platform Section - Center */}
          <Box sx={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            '@media (max-width: 768px)': {
              alignItems: 'flex-start',
            },
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#ffffff',
                mb: 2,
                fontSize: '1rem',
              }}
            >
              Platform
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              alignItems: 'start',
            }}>
              <Link
                href="/about"
                sx={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  display: 'block',
                  '&:hover': {
                    color: '#ffffff',
                    textDecoration: 'underline',
                  },
                }}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                sx={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  display: 'block',
                  '&:hover': {
                    color: '#ffffff',
                    textDecoration: 'underline',
                  },
                }}
              >
                Contact
              </Link>
            </Box>
          </Box>

          {/* Social Section - End */}
          <Box sx={{ 
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '@media (max-width: 768px)': {
              alignItems: 'start',
            },
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#ffffff',
                mb: 2,
                fontSize: '1rem',
              }}
            >
              Social
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
{/*               <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#9ca3af',
                  p: 1,
                  '&:hover': {
                    color: '#e1306c',
                    backgroundColor: 'rgba(225, 48, 108, 0.1)',
                  },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#9ca3af',
                  p: 1,
                  '&:hover': {
                    color: '#1877f2',
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                  },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton> */}
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#9ca3af',
                  p: 1,
                  '&:hover': {
                    color: '#1da1f2',
                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#9ca3af',
                  p: 1,
                  '&:hover': {
                    color: '#0077b5',
                    backgroundColor: 'rgba(0, 119, 181, 0.1)',
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#9ca3af',
                  p: 1,
                  '&:hover': {
                    color: '#ff0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  },
                }}
              >
                <YouTube fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Copyright Section */}
        <Box
          sx={{
            borderTop: '1px solid #374151',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            © 2025 R2C Research to Commercialization. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

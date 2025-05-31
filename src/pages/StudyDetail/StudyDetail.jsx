import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Link,
  Chip,
  TextField,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const StudyDetailPage = () => {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInputValue, setChatInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockStudies = {
          "123": {
            id: "123",
            title: "Sample Study: The Impact of AI on Modern Research",
            category: "Artificial Intelligence",
            abstract: "This study explores the profound impact of artificial intelligence on various research methodologies and outcomes across different scientific disciplines. It delves into machine learning applications, natural language processing in literature reviews, and AI-driven data analysis.\n\nFurther details include case studies and predictive models showcasing the transformative potential of AI in accelerating discovery and innovation."
          }
        };

        if (mockStudies[id]) {
          setStudy(mockStudies[id]);
        } else {
          const response = await fetch(`http://localhost:5000/studies/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              setStudy(null);
              throw new Error(`Study with ID ${id} not found.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setStudy(data);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setError(e.message);
        if (!study && e.message.includes("not found")) {
            setStudy(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudy();
    }
  }, [id]);

  const handleChatSend = () => {
    if (chatInputValue.trim() === '') return;

    const newUserMessage = {
      id: Date.now(),
      text: chatInputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);

    setTimeout(() => {
      const botResponseText = `This is a mock AI response to: "${chatInputValue}". Real functionality will be implemented later.`;
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000 + Math.random() * 500);

    setChatInputValue('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', mt: '64px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !study) {
    return (
      <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: 'center', py: 3 }}>
        <Typography variant="h5" color="error">Error loading study</Typography>
        <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
        <Link component={RouterLink} to="/studies" sx={{ mt: 2, display: 'inline-flex', alignItems: 'center' }}>
          <ArrowBackIcon sx={{ mr: 0.5 }} />
          Go back to studies
        </Link>
      </Container>
    );
  }

  if (!study) {
    return (
      <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: 'center', py: 3 }}>
        <Typography variant="h5">Study Not Found</Typography>
        <Typography sx={{ mt: 1 }}>The study you are looking for does not exist or could not be loaded.</Typography>
        <Link component={RouterLink} to="/studies" sx={{ mt: 2, display: 'inline-flex', alignItems: 'center' }}>
          <ArrowBackIcon sx={{ mr: 0.5 }} />
          Go back to studies
        </Link>
      </Container>
    );
  }

  const actionButtonSx = {
    textTransform: 'none',
    fontWeight: 500,
    color: 'text.primary',
    borderColor: "#D7DAE0",
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  };

  return (
    <Box sx={{
      backgroundColor: '#F9FAFB',
      paddingTop: { xs: '80px', sm: '100px', md: '100px' },
      paddingBottom: { xs: '40px', sm: '60px' },
      minHeight: 'calc(100vh - 64px)',
      overflowX: 'hidden',
      width: '100%',
    }}>
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: { xs: '16px', sm: '24px', md: '48px', lg: '70px' },
          paddingRight: { xs: '16px', sm: '24px', md: '48px', lg: '70px' },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Link
          component={RouterLink}
          to="/studies"
          variant="body1"
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1,
            borderRadius: '8px', textDecoration: 'none', color: 'text.secondary',
            backgroundColor: '#F9FAFB', fontWeight: 500, mb: { xs: 3, sm: 4 },
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { color: '#1a1a1a', backgroundColor: '#F0F0F0' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          Back to Studies
        </Link>

        <Box sx={{
          display: 'flex', flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 }, width: '100%',
        }}>
          <Box sx={{
            width: { xs: '100%', md: 'calc(60% - 16px)' },
            minWidth: 0,
          }}>
            <Typography
              variant="h3" component="h1" gutterBottom
              sx={{
                fontWeight: 'bold', mb: { xs: 1.5, sm: 2 }, color: '#111827',
                fontSize: { xs: '1.875rem', sm: '1.9rem', md: '2rem', lg: '2.4rem' },
                wordBreak: 'break-word',
              }}
            >
              {study.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 }, mb: { xs: 3, sm: 4 }, color: 'text.secondary' }}>
              {study.category && (
                <Chip
                  label={study.category} size="small"
                  sx={{
                    backgroundColor: "#DBEAFE", color: '#1E40B4', p: '4px 8px', height: 'auto',
                    lineHeight: '1.5', fontSize: '0.8125rem', fontWeight: "500",
                  }}
                />
              )}
            </Box>

            {study.abstract && (
              <Box sx={{
                mt: { xs: 3, sm: 4 }, mb: { xs: 3, sm: 4 }, padding: { xs: 2, sm: 3 },
                backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <Typography variant="h5" component="h2" sx={{
                  fontWeight: 'bold', color: '#111827', mb: 1.5,
                  fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' }
                }}>
                  Abstract
                </Typography>
                <Typography variant="body1" component="p" sx={{
                  lineHeight: { xs: 1.6, sm: 1.7 }, fontSize: { xs: '0.9375rem', sm: '1rem' },
                  color: '#374151', whiteSpace: 'pre-line', wordBreak: 'break-word',
                }}>
                  {study.abstract}
                </Typography>
              </Box>
            )}

            {study && (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: study.abstract ? { xs: 2.5, sm: 3 } : 0,
                mb: { xs: 3, sm: 4 },
              }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => console.log('Download PDF button clicked. Study ID:', study.id)}
                  sx={actionButtonSx}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => console.log('Share button clicked. Study ID:', study.id)}
                  sx={actionButtonSx}
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MailOutlineIcon />}
                  onClick={() => console.log('Contact Researcher button clicked. Study ID:', study.id)}
                  sx={actionButtonSx}
                >
                  Contact Researcher
                </Button>
              </Box>
            )}

          </Box>

          <Box sx={{
            width: { xs: '100%', md: 'calc(40% - 16px)' },
            minWidth: 0,
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: { xs: '16px', sm: '20px', md: '24px' },
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            height: { md: 'auto' },
            position: 'sticky',
            top: '20px',
            alignSelf: { xs: 'auto', md: 'flex-start' },
            maxHeight: `calc(100vh - 20px - 20px)`,
          }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ChatIcon sx={{ color: '#4B5563', mr: 1, fontSize: '1.6rem' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: '600', color: '#111827' }}>
                Chat with this Paper
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2.5, fontSize: '0.875rem' }}>
              Ask questions about this research paper and get instant answers from our AI assistant.
            </Typography>

            <Box sx={{
              flexGrow: 1, mb: 2.5, p: 2, backgroundColor: '#F9FAFB',
              borderRadius: '8px', minHeight: '250px',
              maxHeight: { xs: '300px', md: '400px' },
              overflowY: 'auto', overflowX: 'hidden', display: 'flex',
              flexDirection: 'column', border: '1px solid #E5E7EB',
              width: '100%', boxSizing: 'border-box',
            }}>
              {chatMessages.length === 0 ? (
                <Box sx={{ textAlign: 'center', color: '#6B7280', m: 'auto', p: 2 }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: '3rem', mb: 1.5, color: '#9CA3AF' }} />
                  <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                    Ask a question about this study to start a conversation
                  </Typography>
                </Box>
              ) : (
                chatMessages.map(msg => (
                  <Box
                    key={msg.id}
                    sx={{
                      mb: 1.5, p: '10px 14px',
                      borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      backgroundColor: msg.sender === 'user' ? '#3B82F6' : '#E5E7EB',
                      color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937',
                      marginLeft: msg.sender === 'user' ? 'auto' : '0',
                      marginRight: msg.sender === 'user' ? '0' : 'auto',
                      maxWidth: '85%', minWidth: 0, wordBreak: 'break-word',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '0.9rem',
                      boxSizing: 'border-box', width: 'fit-content',
                    }}
                  >
                    <Typography variant="body2" component="p" sx={{ lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.text}</Typography>
                    <Typography variant="caption" sx={{
                      display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left',
                      fontSize: '0.7rem', color: msg.sender === 'user' ? '#EFF6FF' : '#4B5563', mt: 0.5
                    }}>
                      {msg.timestamp}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              borderTop: '1px solid #E5E7EB', pt: 2, width: '100%', boxSizing: 'border-box',
            }}>
              <TextField
                fullWidth variant="outlined" placeholder="Ask a question about this study..."
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                size="small"
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px', backgroundColor: '#FFFFFF', fontSize: '0.9rem',
                    '& fieldset': { borderColor: '#D1D5DB', },
                    '&:hover fieldset': { borderColor: '#9CA3AF', },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6', },
                  },
                  '& .MuiInputBase-input::placeholder': { color: '#9CA3AF', opacity: 1, },
                }}
              />
              <Button
                variant="contained" onClick={handleChatSend} disabled={!chatInputValue.trim()}
                sx={{
                  py: '9px', px: 2.5, borderRadius: '8px', backgroundColor: '#3B82F6',
                  flexShrink: 0,
                  '&:hover': { backgroundColor: '#2563EB', },
                  '&.Mui-disabled': { backgroundColor: '#9CA3AF', color: '#E5E7EB' }
                }}
              >
                <SendIcon sx={{ fontSize: '1.25rem' }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StudyDetailPage;
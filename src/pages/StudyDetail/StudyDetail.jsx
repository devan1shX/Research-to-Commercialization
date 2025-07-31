import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Link,
  Chip,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const StudyDetailPage = () => {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInputValue, setChatInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        setError(null);
        setStudy(null); 
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockStudies = {
          123: {
            id: "123",
            title: "Sample Study: The Impact of AI on Modern Research",
            category: "Artificial Intelligence",
            genres: ["Artificial Intelligence", "Machine Learning"],
            abstract:
              "This study explores the profound impact of artificial intelligence on various research methodologies and outcomes across different scientific disciplines. It delves into machine learning applications, natural language processing in literature reviews, and AI-driven data analysis.\n\nFurther details include case studies and predictive models showcasing the transformative potential of AI in accelerating discovery and innovation.",
            documents: [
              {
                display_name: "Full Paper.pdf",
                file_location: "/documents/sample-paper.pdf",
              },
              {
                display_name: "Appendix A.docx",
                file_location: "/documents/appendix-a.docx",
              },
            ],
            questions: [
              {
                question:
                  "What is the main focus of this study? How does AI impact various scientific fields and what are the primary methodologies discussed within the paper regarding this impact?",
                answer:
                  "The study focuses on the impact of AI on modern research methodologies and outcomes across various scientific fields. It primarily discusses machine learning, NLP, and AI-driven data analysis.",
              },
              {
                question:
                  "Which specific AI applications, algorithms, or models are highlighted or analyzed in detail throughout this research documentation and its supplementary materials?",
                answer:
                  "Machine learning applications, natural language processing in literature reviews, and AI-driven data analysis are discussed. The supplementary materials might contain specifics on algorithms like BERT for NLP or CNNs for image analysis if applicable.",
              },
              {
                question:
                  "Does the study include comprehensive case studies or is it more of a theoretical overview with predictive modelling based on existing literature?",
                answer:
                  "Yes, the study includes case studies and predictive models to showcase AI's transformative potential. It aims to provide both practical examples and forward-looking insights.",
              },
            ],
            patent_status: "Patent Pending",
            additional_info: {
              "Lead Researcher": "Dr. AI Expert",
              "Funding Source": "Tech Innovations Grant",
            },
          },
        };

        if (mockStudies[id]) {
          setStudy(mockStudies[id]);
        } else {
          const response = await fetch(`/api/studies/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudy();
    }
  }, [id]);

  const handleChatSend = () => {
    if (chatInputValue.trim() === "") return;
    const newUserMessage = {
      id: Date.now(),
      text: chatInputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setTimeout(() => {
      const botResponseText = `This is a mock AI response to: "${chatInputValue}". Real functionality will be implemented later.`;
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000 + Math.random() * 500);
    setChatInputValue("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
          mt: "64px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !study) {
    return (
      <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: "center", py: 3 }}>
        <Typography variant="h5" color="error">
          Error loading study
        </Typography>
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
        <Link
          component={RouterLink}
          to="/studies"
          sx={{ mt: 2, display: "inline-flex", alignItems: "center" }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} /> Go back to studies
        </Link>
      </Container>
    );
  }

  if (!study) {
    return (
      <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: "center", py: 3 }}>
        <Typography variant="h5">Study Not Found</Typography>
        <Typography sx={{ mt: 1 }}>
          The study you are looking for does not exist or could not be loaded.
        </Typography>
        <Link
          component={RouterLink}
          to="/studies"
          sx={{ mt: 2, display: "inline-flex", alignItems: "center" }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} /> Go back to studies
        </Link>
      </Container>
    );
  }

  const actionButtonSx = {
    textTransform: "none",
    fontWeight: 500,
    color: "text.primary",
    borderColor: "#D7DAE0",
    "&:hover": { backgroundColor: "action.hover" },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9FAFB",
        paddingTop: { xs: "80px", sm: "100px", md: "100px" },
        paddingBottom: { xs: "40px", sm: "60px" },
        minHeight: "calc(100vh - 64px)",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: { xs: "16px", sm: "24px", md: "48px", lg: "70px" },
          paddingRight: { xs: "16px", sm: "24px", md: "48px", lg: "70px" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Link
          component={RouterLink}
          to="/studies"
          variant="body2"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.75,
            borderRadius: "6px",
            textDecoration: "none",
            color: "text.secondary",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            fontWeight: 500,
            mb: { xs: 3, sm: 4 },
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: "#111827",
              backgroundColor: "#F3F4F6",
              borderColor: "#D1D5DB",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Studies
        </Link>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          <Box
            sx={{ width: { xs: "100%", md: "calc(60% - 16px)" }, minWidth: 0 }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: { xs: 1.5, sm: 2 },
                color: "#111827",
                fontSize: {
                  xs: "1.875rem",
                  sm: "1.9rem",
                  md: "2rem",
                  lg: "2.4rem",
                },
                wordBreak: "break-word",
              }}
            >
              {study.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 1, sm: 1.5 },
                mb: { xs: 3, sm: 4 },
                color: "text.secondary",
              }}
            >
              {Array.isArray(study.genres) && study.genres.length > 0 ? (
                study.genres.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    size="small"
                    sx={{
                      backgroundColor: "#DBEAFE",
                      color: "#1E40B4",
                      p: "4px 8px",
                      height: "auto",
                      lineHeight: "1.5",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                    }}
                  />
                ))
              ) : study.category ? (
                <Chip
                  label={study.category}
                  size="small"
                  sx={{
                    backgroundColor: "#DBEAFE",
                    color: "#1E40B4",
                    p: "4px 8px",
                    height: "auto",
                    lineHeight: "1.5",
                    fontSize: "0.8125rem",
                    fontWeight: "500",
                  }}
                />
              ) : null}
            </Box>
            {study.abstract && (
              <Box
                sx={{
                  mt: { xs: 3, sm: 4 },
                  mb: { xs: 3, sm: 4 },
                  padding: { xs: 2, sm: 3 },
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "#111827",
                    mb: 1.5,
                    fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                  }}
                >
                  Abstract
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                    lineHeight: { xs: 1.6, sm: 1.7 },
                    fontSize: { xs: "0.9375rem", sm: "1rem" },
                    color: "#374151",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {study.abstract}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "calc(40% - 16px)" },
              minWidth: 0,
              maxWidth: "100%",
              backgroundColor: "#FFFFFF",
              padding: { xs: "16px", sm: "20px", md: "24px" },
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              height: { md: "auto" },
              position: { xs: "relative", md: "sticky" },
              top: { xs: 0, md: "100px" },
              alignSelf: { xs: "auto", md: "flex-start" },
              maxHeight: { md: `calc(100vh - 100px - 40px)` },
            }}
          >
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <ChatIcon sx={{ color: "#4B5563", mr: 1, fontSize: "1.6rem" }} />
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "600", color: "#111827" }}
              >
                Chat with this Paper
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", mb: 2.5, fontSize: "0.875rem" }}
            >
              Ask questions about this research paper and get instant answers
              from our AI assistant.
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                mb: 2.5,
                p: 1.5,
                backgroundColor: "#F9FAFB",
                borderRadius: "8px",
                minHeight: "200px",
                maxHeight: { xs: "250px", md: "350px" },
                overflowY: "auto",
                border: "1px solid #E5E7EB",
              }}
            >
              {chatMessages.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#6B7280",
                    m: "auto",
                    p: 2,
                  }}
                >
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: "3rem", mb: 1.5, color: "#9CA3AF" }}
                  />
                  <Typography variant="body1" sx={{ fontSize: "0.95rem" }}>
                    Ask a question to start
                  </Typography>
                </Box>
              ) : (
                chatMessages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      mb: 1.5,
                      p: "10px 14px",
                      borderRadius:
                        msg.sender === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                      backgroundColor:
                        msg.sender === "user" ? "#3B82F6" : "#E5E7EB",
                      color: msg.sender === "user" ? "#FFFFFF" : "#1F2937",
                      marginLeft: msg.sender === "user" ? "auto" : "0",
                      marginRight: msg.sender === "user" ? "0" : "auto",
                      maxWidth: "85%",
                      wordBreak: "break-word",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      fontSize: "0.9rem",
                      width: "fit-content",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {msg.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: msg.sender === "user" ? "right" : "left",
                        fontSize: "0.7rem",
                        color: msg.sender === "user" ? "#EFF6FF" : "#4B5563",
                        mt: 0.5,
                      }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderTop: "1px solid #E5E7EB",
                pt: 2,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question..."
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
                size="small"
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.9rem",
                    "& fieldset": { borderColor: "#D1D5DB" },
                    "&:hover fieldset": { borderColor: "#9CA3AF" },
                    "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#9CA3AF",
                    opacity: 1,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleChatSend}
                disabled={!chatInputValue.trim()}
                sx={{
                  py: "9px",
                  px: 2.5,
                  borderRadius: "8px",
                  backgroundColor: "#3B82F6",
                  flexShrink: 0,
                  "&:hover": { backgroundColor: "#2563EB" },
                  "&.Mui-disabled": {
                    backgroundColor: "#9CA3AF",
                    color: "#E5E7EB",
                  },
                }}
              >
                <SendIcon sx={{ fontSize: "1.25rem" }} />
              </Button>
            </Box>
          </Box>
        </Box>

        {study &&
          Array.isArray(study.questions) &&
          study.questions.length > 0 && (
            <Box
              sx={{
                mt: { xs: 4, md: 6 },
                width: "100%",
                backgroundColor: "#FFFFFF",
                paddingLeft: { xs: "16px", sm: "24px", md: "48px", lg: "70px" },
                paddingRight: {
                  xs: "16px",
                  sm: "24px",
                  md: "48px",
                  lg: "70px",
                },
                paddingTop: { xs: "16px", sm: "24px" },
                paddingBottom: { xs: "16px", sm: "24px" },
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#111827",
                  mb: 3,
                  textAlign: "left",
                }}
              >
                Frequently Asked Questions
              </Typography>
              {study.questions.map((qa, index) => (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  sx={{
                    mb: 1.5,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    border: "1px solid #E5E7EB",
                    "&:before": { display: "none" },
                    borderRadius: "8px !important",
                    "&.Mui-expanded": {
                      margin: "12px 0 !important",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`faq-panel${index}-content`}
                    id={`faq-panel${index}-header`}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#F9FAFB" : "#F3F4F6",
                      borderRadius: "8px",
                      minHeight: "56px",
                      "&.Mui-expanded": {
                        borderBottom: "1px solid #E5E7EB",
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0",
                      },
                      "& .MuiAccordionSummary-content": {
                        fontWeight: 500,
                        color: "#1F2937",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%",
                        wordBreak: "break-word",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {qa.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      backgroundColor: "#FFFFFF",
                      py: 2,
                      px: 2.5,
                      borderTop: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4B5563",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                    >
                      {qa.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
      </Container>
    </Box>
  );
};

export default StudyDetailPage;

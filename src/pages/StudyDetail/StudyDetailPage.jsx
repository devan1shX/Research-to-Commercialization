import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import NotFoundState from "./NotFoundState";
import StudyDetails from "./StudyDetails";
import ChatWithPaper from "./ChatWithPaper";
import RelatedQuestions from "./RelatedQuestions";

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

        const response = await fetch(`http://localhost:5000/studies/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Study with ID ${id} not found.`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudy(data);
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
    setChatMessages((prev) => [...prev, newUserMessage]);

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
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1000 + Math.random() * 500);

    setChatInputValue("");
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!study) return <NotFoundState />;

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
            fontWeight: 500,
            mb: { xs: 3, sm: 4 },
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
          <StudyDetails study={study} />
          <ChatWithPaper
            chatMessages={chatMessages}
            chatInputValue={chatInputValue}
            setChatInputValue={setChatInputValue}
            handleChatSend={handleChatSend}
          />
        </Box>
        <RelatedQuestions questions={study.questions} />
      </Container>
    </Box>
  );
};

export default StudyDetailPage;

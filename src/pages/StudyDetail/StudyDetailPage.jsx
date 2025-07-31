import React, { useState, useEffect, useRef } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import NotFoundState from "./NotFoundState";
import StudyDetails from "./StudyDetails";
import ChatWithPaper from "./ChatWithPaper";
import RelatedQuestions from "./RelatedQuestions";
import { useAuth } from "../../AuthContext";

const StudyDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInputValue, setChatInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  const fetchInitiated = useRef(false);

  useEffect(() => {
    if (id && !fetchInitiated.current) {
      fetchInitiated.current = true;

      const fetchStudy = async () => {
        try {
          setLoading(true);
          setError(null);
          setStudy(null);

          const response = await fetch(`/api/studies/${id}`);
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

      fetchStudy();
    }
  }, [id]);

  const handleChatSend = async () => {
    if (chatInputValue.trim() === "" || isReplying) return;
    if (!currentUser) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "You must be logged in to chat.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      return;
    }

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

    const promptForApi = chatInputValue;
    setChatInputValue("");
    setIsReplying(true);

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch("/api/studies/chat-with-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: promptForApi,
          studyId: id,
          chatHistory: [...chatMessages, newUserMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "An error occurred during the request."
        );
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.instant_answer,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${e.message}`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
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
            isReplying={isReplying}
          />
        </Box>
        {study.questions && study.questions.length > 0 && (
          <RelatedQuestions questions={study.questions} />
        )}
      </Container>
    </Box>
  );
};

export default StudyDetailPage;

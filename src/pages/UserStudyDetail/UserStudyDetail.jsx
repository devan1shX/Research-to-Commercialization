import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  List,
  ListItem,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import StudyDetails from "./StudyDetails";
import ChatWithPaper from "./ChatWithPaper";
import RelatedQuestions from "./RelatedQuestions";

const LoadingState = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 120px)",
    }}
  >
    <CircularProgress />
  </Box>
);

const ErrorState = ({ message, onRetry }) => (
  <Container
    sx={{ textAlign: "center", py: 8, minHeight: "calc(100vh - 120px)" }}
  >
    <Typography color="error" variant="h6">
      Failed to load study
    </Typography>
    <Typography sx={{ mt: 1 }}>{message}</Typography>
    <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
      Try Again
    </Button>
  </Container>
);

const NotFoundState = () => (
  <Container
    sx={{ textAlign: "center", py: 8, minHeight: "calc(100vh - 120px)" }}
  >
    <Typography variant="h6">Study not found.</Typography>
  </Container>
);

const UserStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chatInputValue, setChatInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  const fetchStudy = async () => {
    if (!currentUser) {
      setError("Please log in to view this page.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(`/api/my-studies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const data = await response.json();
      setStudy(data);
    } catch (err) {
      console.error("Failed to fetch study details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudy();
  }, [id, currentUser]);

  const handleChatSend = async () => {
    if (chatInputValue.trim() === "" || isReplying) return;

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
  if (error) return <ErrorState message={error} onRetry={() => fetchStudy()} />;
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
        <MuiLink
          component={RouterLink}
          to="/dashboard"
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
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Dashboard
        </MuiLink>

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

export default UserStudyDetail;

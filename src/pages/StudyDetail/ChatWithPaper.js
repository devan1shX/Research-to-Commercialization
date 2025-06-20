import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";

const ChatWithPaper = ({
  chatMessages,
  chatInputValue,
  setChatInputValue,
  handleChatSend,
}) => {
  return (
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
        Ask questions about this research paper and get instant answers from our
        AI assistant.
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
                backgroundColor: msg.sender === "user" ? "#3B82F6" : "#E5E7EB",
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
  );
};

export default ChatWithPaper;

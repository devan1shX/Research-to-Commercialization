import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const RelatedQuestions = ({ questions }) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: { xs: 6, sm: 6, md: 8 },
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: "#1A202C",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            textAlign: "left",
            mb: 2,
          }}
        >
          Related Questions
        </Typography>
        
        
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #E5E7EB",
        }}
      >
        {questions.map((qa, index) => (
          <Accordion
            key={index}
            defaultExpanded={index === 0}
            elevation={0}
            sx={{
              border: "none",
              borderBottom: "1px solid #E5E7EB",
              borderRadius: "0 !important",
              backgroundColor: "transparent",
              "&:before": { display: "none" },
              "&:last-child": {
                borderBottom: "1px solid #E5E7EB",
              },
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
              transition: "background-color 0.15s ease-in-out",
            }}
          >
            <AccordionSummary
              expandIcon={null}
              sx={{
                px: 0,
                py: { xs: 2.5, sm: 3 },
                minHeight: "auto",
                backgroundColor: "transparent",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.125rem" },
                  lineHeight: 1.4,
                  pr: 3,
                  flex: 1,
                  wordBreak: "break-word",
                }}
              >
                {qa.question}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#F3F4F6",
                  border: "1px solid #E5E7EB",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                    borderColor: "#2563EB",
                    "& .MuiSvgIcon-root": {
                      color: "#FFFFFF",
                    },
                  },
                  ".Mui-expanded &": {
                    backgroundColor: "#2563EB",
                    borderColor: "#2563EB",
                    "& .MuiSvgIcon-root": {
                      color: "#FFFFFF",
                      transform: "rotate(45deg)",
                    },
                  },
                }}
              >
                <AddIcon
                  sx={{
                    color: "#6B7280",
                    fontSize: "1.1rem",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                px: 0,
                pb: { xs: 3, sm: 3.5 },
                pt: 0,
              }}
            >
              <Typography
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  lineHeight: 1.7,
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  maxWidth: "calc(100% - 60px)",
                }}
              >
                {qa.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default RelatedQuestions;

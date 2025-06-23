import React from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const RelatedQuestions = ({ questions, handleArrayItemChange }) => {
  const theme = useTheme();

  if (!questions) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          mt: 4,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
          >
            Generated Questions
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            These questions were automatically generated. You can review and
            edit the answers below.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        {questions.map((qa, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            defaultExpanded={true}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: "16px",
              backgroundColor: "background.paper",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                transform: "translateY(-2px)",
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.common.black,
                  0.08
                )}`,
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              "&:hover:not(.Mui-expanded)": {
                borderColor: alpha(theme.palette.primary.main, 0.15),
                backgroundColor: alpha(theme.palette.primary.main, 0.01),
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: "text.secondary" }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.4,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                }}
              >
                {qa.question.trim() || `Question ${index + 1}`}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                pt: 0,
                pb: { xs: 2.5, sm: 3 },
                px: { xs: 2, sm: 3 },
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Answer"
                name="answer"
                value={qa.answer}
                onChange={(e) => handleArrayItemChange("questions", index, e)}
                multiline
                minRows={4}
                placeholder="Review and edit the generated answer..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.8
                      ),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "background.paper",
                      boxShadow: `0 0 0 2px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  },
                }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
};

export default RelatedQuestions;
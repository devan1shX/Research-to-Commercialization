import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  ExpandMore,
} from "@mui/icons-material";

/**
 * RelatedQuestions component for the Edit Study page.
 * This component displays a list of questions and answers in an accordion style.
 * Users can add, edit, or remove question-answer pairs.
 * The UI is based on the FaqSection from the Create Study page.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.questions - An array of question-answer objects. Each object should have 'id', 'question', and 'answer' properties.
 * @param {Function} props.handleQuestionChange - Function to handle changes in the question or answer text fields. Called with the question's unique ID and the event object.
 * @param {Function} props.addQuestionField - Function to add a new, empty question-answer pair to the list.
 * @param {Function} props.removeQuestionField - Function to remove a question-answer pair from the list by its unique ID.
 */
const RelatedQuestions = ({
  questions,
  handleQuestionChange,
  addQuestionField,
  removeQuestionField,
}) => {
  const theme = useTheme();

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
            Related Questions
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            Edit the questions and answers about your research.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        {questions.map((qa, index) => (
          <Accordion
            // FIX: Use the stable, unique 'id' for the key instead of the array index.
            key={qa.id}
            defaultExpanded={!qa.question && !qa.answer}
            disableGutters
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: "16px",
              backgroundColor: "background.paper",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                my: 0,
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
              expandIcon={
                <ExpandMore
                  sx={{
                    color: "text.secondary",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              }
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                minHeight: "auto",
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  margin: 0,
                },
                "& .MuiAccordionSummary-expandIconWrapper": { marginLeft: 1 },
                borderRadius: "16px",
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.4,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  }}
                >
                  {qa.question?.trim() || `Question ${index + 1}`}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                pt: 0,
                pb: { xs: 2.5, sm: 3 },
                px: { xs: 2, sm: 3 },
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Question"
                  name="question"
                  value={qa.question}
                  // FIX: Pass the unique 'id' to the handler function.
                  onChange={(e) => handleQuestionChange(qa.id, e)}
                  multiline
                  minRows={2}
                  placeholder="e.g., What is the main objective of this study?"
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
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Answer"
                  name="answer"
                  value={qa.answer}
                  // FIX: Pass the unique 'id' to the handler function.
                  onChange={(e) => handleQuestionChange(qa.id, e)}
                  multiline
                  minRows={4}
                  placeholder="Provide a clear and comprehensive answer..."
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}
                >
                  <Button
                    startIcon={<RemoveCircleOutline />}
                    // FIX: Pass the unique 'id' to the handler function.
                    onClick={() => removeQuestionField(qa.id)}
                    color="error"
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                  >
                    Remove Question
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box
          sx={{
            pt: 2,
            display: "flex",
            borderTop:
              questions.length > 0
                ? `1px dashed ${alpha(theme.palette.divider, 0.3)}`
                : "none",
            mt: questions.length > 0 ? 2 : 0,
          }}
        >
          <Button
            startIcon={<AddCircleOutline />}
            onClick={addQuestionField}
            variant="outlined"
            size="medium"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              color: "primary.main",
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                borderColor: "primary.main",
                borderStyle: "solid",
                transform: "translateY(-1px)",
                boxShadow: `0 4px 16px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              },
              "& .MuiButton-startIcon": { transition: "transform 0.2s ease" },
              "&:hover .MuiButton-startIcon": { transform: "rotate(90deg)" },
            }}
          >
            Add Question
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default RelatedQuestions;
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const StudyCard = ({ study, onEdit, onDelete, onNavigate }) => {
  return (
    <Box
      sx={{
        flex: {
          xs: "1 1 100%",
          sm: "1 1 calc(50% - 12px)",
          md: "1 1 calc(33.333% - 16px)",
          lg: "1 1 calc(33.333% - 16px)",
          xl: "1 1 calc(33.333% - 16px)",
        },
        minWidth: {
          xs: "100%",
          sm: "calc(50% - 12px)",
          md: "calc(33.333% - 16px)",
          lg: "calc(33.333% - 16px)",
          xl: "calc(33.333% - 16px)",
        },
        maxWidth: {
          xs: "100%",
          sm: "calc(50% - 12px)",
          md: "calc(33.333% - 16px)",
          lg: "calc(33.333% - 16px)",
          xl: "calc(33.333% - 16px)",
        },
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <CardContent
          onClick={() => onNavigate && onNavigate(study._id)}
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            cursor: "pointer",
            "&:last-child": {
              paddingBottom: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mb: 2,
              alignItems: "center",
            }}
          >
            <Chip
              icon={
                study.approved ? (
                  <CheckCircleIcon sx={{ fontSize: "0.9rem" }} />
                ) : (
                  <CancelIcon sx={{ fontSize: "0.9rem" }} />
                )
              }
              label={study.approved ? "Approved" : "Pending"}
              size="small"
              sx={{
                backgroundColor: study.approved ? "#DCFCE7" : "#FEF3C7",
                color: study.approved ? "#16A34A" : "#D97706",
                fontWeight: "600",
                fontSize: "0.75rem",
                height: "26px",
                borderRadius: "8px",
                marginRight: 1,
                "& .MuiChip-icon": {
                  color: study.approved ? "#16A34A" : "#D97706",
                },
              }}
            />

            {Array.isArray(study.genres) &&
              study.genres.flatMap((genreItem, itemIndex) => {
                if (
                  typeof genreItem === "string" &&
                  genreItem.startsWith("[") &&
                  genreItem.endsWith("]")
                ) {
                  try {
                    const parsedGenres = JSON.parse(genreItem);
                    if (Array.isArray(parsedGenres)) {
                      return parsedGenres.map(
                        (individualGenre, parsedIndex) => (
                          <Chip
                            key={`genre-${itemIndex}-parsed-${parsedIndex}-${individualGenre}`}
                            label={individualGenre}
                            size="small"
                            sx={{
                              backgroundColor: "#DBEAFE",
                              color: "#1E40AF",
                              fontWeight: "500",
                              fontSize: "0.75rem",
                              height: "24px",
                              borderRadius: "6px",
                            }}
                          />
                        )
                      );
                    }
                  } catch (e) {}
                }
                if (typeof genreItem === "string") {
                  return (
                    <Chip
                      key={`genre-${itemIndex}-${genreItem}`}
                      label={genreItem}
                      size="small"
                      sx={{
                        backgroundColor: "#DBEAFE",
                        color: "#1E40AF",
                        fontWeight: "500",
                        fontSize: "0.75rem",
                        height: "24px",
                        borderRadius: "6px",
                      }}
                    />
                  );
                }
                return null;
              })}
          </Box>

          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: "600",
              color: "#1a1a1a",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "1.1rem",
              mb: 1,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "calc(1.1rem * 1.4 * 2)",
              "&:hover": {
                color: "#2563EB",
              },
            }}
          >
            {study.title || "Untitled Study"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.9rem",
              lineHeight: 1.5,
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 2,
            }}
          >
            {study.brief_description ||
              study.description ||
              "No description available."}
          </Typography>
        </CardContent>

        <Box
          sx={{
            borderTop: "1px solid #F3F4F6",
            p: 1.5,
            backgroundColor: "#FAFBFC",
            display: "flex",
            gap: 1.5,
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Button
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate && onNavigate(study._id);
            }}
            sx={{
              color: "#2563EB",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: "0.9rem",
              textTransform: "none",
              padding: "4px 8px",
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.05)",
                textDecoration: "underline",
              },
            }}
          >
            Learn More
          </Button>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: "0.9rem" }} />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(study._id);
              }}
              sx={{
                fontSize: "0.8rem",
                px: 1.5,
                py: 0.5,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "6px",
                color: "#1E40AF",
                borderColor: "#DBEAFE",
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                "&:hover": {
                  backgroundColor: "rgba(30, 64, 175, 0.05)",
                  borderColor: "#1E40AF",
                },
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DeleteIcon sx={{ fontSize: "0.9rem" }} />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(study._id);
              }}
              sx={{
                fontSize: "0.8rem",
                px: 1.5,
                py: 0.5,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "6px",
                color: "#DC2626",
                borderColor: "#FECACA",
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                "&:hover": {
                  backgroundColor: "rgba(220, 38, 38, 0.05)",
                  borderColor: "#DC2626",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default StudyCard;

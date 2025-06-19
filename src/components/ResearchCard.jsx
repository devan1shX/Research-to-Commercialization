import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const ResearchCard = ({ study, onClick }) => {
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
        onClick={() => onClick && onClick(study)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          minHeight: "300px",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            "&:last-child": {
              paddingBottom: 3,
            },
          }}
        >
          {Array.isArray(study.genres) && study.genres.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {study.genres.flatMap((genreItem, itemIndex) => {
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
                  } catch (e) {
                  }
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
          )}

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
            {study.title}
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
              WebkitLineClamp: 4,
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

          <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid #F3F4F6" }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: "#2563EB",
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: "0.95rem",
                fontWeight: "500",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Learn More
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResearchCard;

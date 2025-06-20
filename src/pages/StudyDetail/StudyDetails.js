import React from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const actionButtonSx = {
  textTransform: "none",
  fontWeight: 500,
  color: "text.primary",
  borderColor: "#D7DAE0",
  "&:hover": { backgroundColor: "action.hover" },
};

const StudyDetails = ({ study }) => {
  return (
    <Box sx={{ width: { xs: "100%", md: "calc(60% - 16px)" }, minWidth: 0 }}>
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: study.abstract ? { xs: 2.5, sm: 3 } : 0,
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => console.log("Download PDF. Study ID:", study.id)}
          sx={actionButtonSx}
        >
          Download PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={() => console.log("Share. Study ID:", study.id)}
          sx={actionButtonSx}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          startIcon={<MailOutlineIcon />}
          onClick={() => console.log("Contact Researcher. Study ID:", study.id)}
          sx={actionButtonSx}
        >
          Contact Researcher
        </Button>
      </Box>
    </Box>
  );
};

export default StudyDetails;

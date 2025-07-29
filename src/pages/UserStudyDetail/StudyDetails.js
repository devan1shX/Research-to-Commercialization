import React from "react";
import { Box, Typography, Chip, Button, Link as MuiLink, List, ListItem, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArticleIcon from '@mui/icons-material/Article';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const actionButtonSx = {
  textTransform: "none",
  fontWeight: 500,
  color: "text.primary",
  borderColor: "#D7DAE0",
  "&:hover": { backgroundColor: "action.hover" },
};

const sectionSx = {
    mt: { xs: 3, sm: 4 },
    mb: { xs: 3, sm: 4 },
    padding: { xs: 2, sm: 3 },
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const sectionTitleSx = {
    fontWeight: "bold",
    color: "#111827",
    mb: 1.5,
    fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
};

const sectionBodySx = {
    lineHeight: { xs: 1.6, sm: 1.7 },
    fontSize: { xs: "0.9375rem", sm: "1rem" },
    color: "#374151",
    whiteSpace: "pre-line",
    wordBreak: "break-word",
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
            "& .MuiChip-icon": {
              color: study.approved ? "#16A34A" : "#D97706",
            },
          }}
        />
        
        {Array.isArray(study.genres) &&
          study.genres.length > 0 &&
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
          ))}
      </Box>

      <Box sx={sectionSx}>
        {study.abstract && (
            <Box>
                <Typography variant="h5" component="h2" sx={sectionTitleSx}>
                    Abstract
                </Typography>
                <Typography variant="body1" component="p" sx={sectionBodySx}>
                    {study.abstract}
                </Typography>
            </Box>
        )}

        {study.abstract && study.brief_description && <Divider sx={{my: 3}} />}

        {study.brief_description && (
            <Box sx={{ mt: study.abstract ? 0 : 0 }}>
                <Typography variant="h5" component="h2" sx={sectionTitleSx}>
                    Brief Description
                </Typography>
                <Typography variant="body1" component="p" sx={sectionBodySx}>
                    {study.brief_description}
                </Typography>
            </Box>
        )}

        {(study.abstract || study.brief_description) && study.documents && study.documents.length > 0 && <Divider sx={{my: 3}} />}

        {study.documents && study.documents.length > 0 && (
            <Box sx={{ mt: (study.abstract || study.brief_description) ? 0 : 0 }}>
                <Typography variant="h5" component="h2" sx={sectionTitleSx}>
                    Associated Documents
                </Typography>
                <List sx={{p: 0}}>
                    {study.documents.map((doc, index) => (
                      <ListItem key={index} disablePadding sx={{mb: 1}}>
                          <MuiLink 
                            href={`http://r2c.iiitd.edu.in/${doc.file_location}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            sx={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                          >
                              <Button
                                  variant="outlined"
                                  startIcon={<ArticleIcon />}
                                  fullWidth
                                  sx={{ justifyContent: 'flex-start', textTransform: 'none'}}
                              >
                                  {doc.display_name}
                              </Button>
                          </MuiLink>
                      </ListItem>
                    ))}
                </List>
            </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudyDetails;

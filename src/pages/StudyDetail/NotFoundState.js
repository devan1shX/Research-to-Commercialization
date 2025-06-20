import React from "react";
import { Container, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFoundState = () => {
  return (
    <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: "center", py: 3 }}>
      <Typography variant="h5">Study Not Found</Typography>
      <Typography sx={{ mt: 1 }}>
        The study you are looking for does not exist or could not be loaded.
      </Typography>
      <Link
        component={RouterLink}
        to="/studies"
        sx={{ mt: 2, display: "inline-flex", alignItems: "center" }}
      >
        <ArrowBackIcon sx={{ mr: 0.5 }} /> Go back to studies
      </Link>
    </Container>
  );
};

export default NotFoundState;

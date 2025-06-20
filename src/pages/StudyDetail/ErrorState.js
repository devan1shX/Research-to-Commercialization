import React from "react";
import { Container, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ErrorState = ({ error }) => {
  return (
    <Container sx={{ mt: { xs: 12, sm: 15 }, textAlign: "center", py: 3 }}>
      <Typography variant="h5" color="error">
        Error loading study
      </Typography>
      <Typography color="error" sx={{ mt: 1 }}>
        {error}
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

export default ErrorState;

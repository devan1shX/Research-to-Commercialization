import React from "react";
import { Box, TextField } from "@mui/material";

const BasicInfoSection = ({ formData, errors, commonTextFieldProps }) => (
  <>
    <Box sx={{ mb: 1 }}>
      <TextField
        {...commonTextFieldProps("title", "Study Title", true)}
        placeholder="Enter a descriptive title for your research study"
        fullWidth
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": { width: "100%" },
          "& .MuiInputBase-input::placeholder": {
            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
          },
        }}
      />
    </Box>
    <Box sx={{ mb: 1 }}>
      <TextField
        {...commonTextFieldProps("abstract", "Abstract", true)}
        multiline
        rows={4}
        placeholder="Provide a comprehensive abstract of your research..."
        fullWidth
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": { width: "100%" },
          "& .MuiInputBase-input::placeholder": {
            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
          },
        }}
      />
    </Box>
    <Box sx={{ mb: 3 }}>
      <TextField
        {...commonTextFieldProps(
          "brief_description",
          "Brief Description",
          true
        )}
        multiline
        rows={3}
        placeholder="Write a brief description highlighting key aspects..."
        fullWidth
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": { width: "100%" },
          "& .MuiInputBase-input::placeholder": {
            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
          },
        }}
      />
    </Box>
  </>
);

export default BasicInfoSection;

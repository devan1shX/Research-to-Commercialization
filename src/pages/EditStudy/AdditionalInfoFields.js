import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const AdditionalInfoFields = ({
  additionalInfo,
  handleAdditionalInfoChange,
  addAdditionalInfoField,
  removeAdditionalInfoField,
}) => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="h6"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          mb: 3,
          fontWeight: 600,
          color: "text.primary",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Additional Information
      </Typography>

      <Box sx={{ mb: 3 }}>
        {additionalInfo.map((item, index) => (
          <Paper
            key={`addinfo-${index}`}
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              mb: 2.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
              position: "relative",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.light",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "3px",
                height: "100%",
                backgroundColor: "primary.main",
                borderRadius: "2px 0 0 2px",
                opacity: 0.7,
              },
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 2.5 }}
              alignItems="flex-start"
            >
              <Grid item xs={12} sm={5} lg={5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label={`Key ${index + 1}`}
                  name="key"
                  value={item.key}
                  onChange={(e) => handleAdditionalInfoChange(index, e)}
                  placeholder="Enter key name"
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      backgroundColor: "grey.50",
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      height: { xs: "44px", sm: "48px" },
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused": {
                        backgroundColor: "background.paper",
                        "& fieldset": { borderWidth: "2px" },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5} lg={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label={`Value ${index + 1}`}
                  name="value"
                  value={item.value}
                  onChange={(e) => handleAdditionalInfoChange(index, e)}
                  placeholder="Enter value"
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      backgroundColor: "grey.50",
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      height: { xs: "44px", sm: "48px" },
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused": {
                        backgroundColor: "background.paper",
                        "& fieldset": { borderWidth: "2px" },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2} lg={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-end", sm: "center" },
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <IconButton
                    onClick={() => removeAdditionalInfoField(index)}
                    color="error"
                    size="small"
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: "error.light",
                      backgroundColor: "error.50",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "white",
                        borderColor: "error.main",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <RemoveCircleOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 12 },
                right: { xs: 8, sm: 12 },
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              {index + 1}
            </Box>
          </Paper>
        ))}
        {additionalInfo.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              mb: 2.5,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "grey.50",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                fontSize: { xs: "0.875rem", sm: "0.9rem" },
              }}
            >
              No additional information fields added yet
            </Typography>
          </Paper>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-start" },
          mb: 2,
        }}
      >
        <Button
          startIcon={<AddCircleOutline />}
          onClick={addAdditionalInfoField}
          variant="outlined"
          size="small"
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            borderRadius: "12px",
            bgcolor: "#2563eb",
            color: "white",
            textTransform: "none",
            "&:hover": { bgcolor: "#1d4ed8" },
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add Info Field
        </Button>
      </Box>
    </Grid>
  );
};

export default AdditionalInfoFields;

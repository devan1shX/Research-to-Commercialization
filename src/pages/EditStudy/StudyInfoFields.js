import React from "react";
import {
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Popper,
  Box,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import { Gavel } from "@mui/icons-material";

const StudyInfoFields = ({
  formData,
  errors,
  handleChange,
  handleGenresChange,
  suggestedGenres,
  patentStatuses,
}) => {
  const theme = useTheme();

  const commonTextFieldProps = (name, label, required = false) => ({
    fullWidth: true,
    variant: "outlined",
    margin: "normal",
    name: name,
    label: label,
    value: formData[name] || "",
    onChange: handleChange,
    required: required,
    error: !!errors[name],
    helperText: errors[name] || "",
    InputLabelProps: { shrink: true },
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        transition: "all 0.3s ease-in-out",
        "& fieldset": {
          borderColor: alpha(theme.palette.divider, 0.3),
          borderWidth: "1.5px",
        },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
          borderWidth: "2px",
          
        },
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
        fontWeight: 600,
        fontSize: { xs: "0.9rem", sm: "1rem" },
        color: theme.palette.text.primary,
      },
      "& .MuiInputBase-input": {
        fontSize: { xs: "0.9rem", sm: "1rem" },
        fontWeight: 400,
      },
    },
  });

  return (
    <>
      <Grid item xs={12} mb={2}>
        <TextField {...commonTextFieldProps("title", "Study Title", true)} />
      </Grid>
      <Grid item xs={12} mb={2}>
        <TextField
          {...commonTextFieldProps("abstract", "Abstract", true)}
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={12} mb={2}>
        <TextField
          {...commonTextFieldProps(
            "brief_description",
            "Brief Description",
            true
          )}
          multiline
          rows={3}
        />
      </Grid>

      <Grid item xs={12} >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            width: "100%",
            alignItems: "stretch",
            mt: { xs: 4, sm: 4, md: 4 },
          }}
        >
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Autocomplete
              multiple
              options={suggestedGenres}
              value={formData.genres}
              onChange={(event, newValue) => {
                if (newValue.length <= 3) {
                  handleGenresChange(event, newValue);
                }
              }}
              freeSolo
              disablePortal
              PopperComponent={(props) => (
                <Popper
                  {...props}
                  placement="bottom-start"
                  modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
                  sx={{
                    zIndex: 1300,
                    "& .MuiAutocomplete-paper": {
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        0.1
                      )}`,
                    },
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="filled"
                      label={option}
                      {...tagProps}
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        height: { xs: "28px", sm: "32px" },
                        "& .MuiChip-deleteIcon": {
                          color: theme.palette.primary.main,
                          fontSize: { xs: "16px", sm: "18px" },
                          "&:hover": { color: theme.palette.primary.dark },
                        },
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.12
                          ),
                          transform: "translateY(-1px)",
                          boxShadow: `0 2px 8px ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => {
                const remaining = 3 - formData.genres.length;
                let placeholder = "Type or select research areas";
                if (formData.genres.length > 0) {
                  if (remaining > 1) placeholder = `Add ${remaining} more areas`;
                  else if (remaining === 1) placeholder = "Add 1 more area";
                  else placeholder = "Maximum reached";
                }
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Research Genres"
                    placeholder={placeholder}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontWeight: 600,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: theme.palette.text.primary,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.6
                        ),
                        transition: "all 0.3s ease-in-out",
                        minHeight: { xs: "56px", sm: "64px" },
                        "& fieldset": {
                          borderColor: alpha(theme.palette.divider, 0.3),
                          borderWidth: "1.5px",
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: "2px",
                          boxShadow: `0 0 0 3px ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )}`,
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        fontWeight: 400,
                        "&::placeholder": {
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          color: alpha(theme.palette.text.secondary, 0.7),
                          fontStyle: "italic",
                        },
                      },
                    }}
                  />
                );
              }}
            />
            <Box
              sx={{
                mt: 1,
                px: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  fontWeight: 400,
                }}
              >
                Select up to 3 research areas
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    formData.genres.length >= 3
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  fontWeight: 500,
                }}
              >
                {formData.genres.length}/3
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    0.6
                  ),
                  transition: "all 0.3s ease-in-out",
                  minHeight: { xs: "56px", sm: "64px" },
                  "& fieldset": {
                    borderColor: alpha(theme.palette.divider, 0.3),
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: "2px",
                    boxShadow: `0 0 0 3px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 400,
                },
              }}
            >
              <Select
                name="patent_status"
                value={formData.patent_status}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: alpha(theme.palette.text.secondary, 0.6),
                        }}
                      >
                        <Gavel
                          sx={{
                            mr: 1.5,
                            fontSize: { xs: 18, sm: 20 },
                            opacity: 0.6,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          Patent Status
                        </Typography>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                      }}
                    >
                      <Gavel
                        sx={{
                          mr: 1.5,
                          fontSize: { xs: 18, sm: 20 },
                          color: theme.palette.primary.main,
                        }}
                      />
                      {selected}
                    </Box>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        0.1
                      )}`,
                      mt: 1,
                      maxHeight: 300,
                      "& .MuiMenuItem-root": {
                        px: 2,
                        py: 1.5,
                        borderRadius: "8px",
                        mx: 1,
                        mb: 0.5,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.12
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.16
                            ),
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontStyle: "italic",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <em>Not Specified</em>
                  </Box>
                </MenuItem>
                {patentStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                      }}
                    >
                      {status}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default StudyInfoFields;
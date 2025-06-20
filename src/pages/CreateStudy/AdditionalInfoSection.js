import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Card,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const AdditionalInfoSection = ({
  additionalInfo,
  errors,
  handleArrayItemChange,
  addArrayItem,
  removeArrayItem,
}) => {
  const theme = useTheme();
  const initialAdditionalInfoState = { key: "", value: "" };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Additional Details
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            Provide any other relevant key-value information.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        {additionalInfo.map((info, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderColor: alpha(theme.palette.divider, 0.4),
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Key"
              name="key"
              value={info.key}
              onChange={(e) =>
                handleArrayItemChange("additional_info", index, e)
              }
              error={!!errors[`additional_info_key_${index}`]}
              helperText={errors[`additional_info_key_${index}`]}
              placeholder="e.g., Funding Source"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Value"
              name="value"
              value={info.value}
              onChange={(e) =>
                handleArrayItemChange("additional_info", index, e)
              }
              error={!!errors[`additional_info_value_${index}`]}
              helperText={errors[`additional_info_value_${index}`]}
              placeholder="e.g., National Science Foundation"
            />
            <IconButton
              onClick={() => removeArrayItem("additional_info", index)}
              color="error"
              aria-label="Remove detail"
            >
              <RemoveCircleOutline />
            </IconButton>
          </Card>
        ))}
      </Stack>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          startIcon={<AddCircleOutline />}
          onClick={() =>
            addArrayItem("additional_info", initialAdditionalInfoState)
          }
          variant="text"
          size="medium"
        >
          Add Detail
        </Button>
      </Box>
    </Box>
  );
};

export default AdditionalInfoSection;

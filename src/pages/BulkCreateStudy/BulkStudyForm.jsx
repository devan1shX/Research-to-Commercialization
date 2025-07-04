import React from "react";
import { Box } from "@mui/material";
import BasicInfoSection from "../CreateStudy/BasicInfoSection";
import ClassificationSection from "../CreateStudy/ClassificationSection";
import RelatedQuestions from "../CreateStudy/RelatedQuestions";

const BulkStudyForm = ({
  formData,
  errors,
  commonTextFieldProps,
  handleGenresChange,
  handleChange,
  handleArrayItemChange,
}) => {
  if (!formData) return null;

  return (
    <Box component="form" noValidate sx={{ mt: 3, width: "100%" }}>
      <BasicInfoSection
        formData={formData}
        errors={errors}
        commonTextFieldProps={commonTextFieldProps}
      />
      <ClassificationSection
        formData={formData}
        handleGenresChange={handleGenresChange}
        handleChange={handleChange}
      />
      <RelatedQuestions
        questions={formData.questions}
        handleArrayItemChange={handleArrayItemChange}
      />
    </Box>
  );
};

export default BulkStudyForm;
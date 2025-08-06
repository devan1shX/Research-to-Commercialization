import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Typography,
  Box,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { CheckCircle, HourglassEmpty, Error } from "@mui/icons-material";

const StudiesTable = ({
  studies,
  onSelectStudy,
  selectedStudyId,
  onToggleSelection,
}) => {
  const getStatusChip = (status) => {
    switch (status) {
      case "analyzed":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Analyzed"
            color="success"
            size="small"
          />
        );
      case "analyzing":
        return (
          <Chip
            icon={<HourglassEmpty />}
            label="Analyzing"
            color="warning"
            size="small"
          />
        );
      case "error":
        return (
          <Chip icon={<Error />} label="Error" color="error" size="small" />
        );
      default:
        return <Chip label="Pending" size="small" />;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="studies table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Tooltip title="Select/Deselect for creation">
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Select
                </Typography>
              </Tooltip>
            </TableCell>
            <TableCell>File Name</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studies.map((study) => (
            <TableRow
              key={study.id}
              hover
              selected={study.id === selectedStudyId}
              sx={{ cursor: "pointer" }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={study.isSelected || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelection(study.id);
                  }}
                  disabled={study.status !== "analyzed"}
                  color="primary"
                  size="small"
                />
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                onClick={() => onSelectStudy(study.id)}
              >
                {study.file.name}
              </TableCell>
              <TableCell onClick={() => onSelectStudy(study.id)}>
                {study.title || "..."}
              </TableCell>
              <TableCell onClick={() => onSelectStudy(study.id)}>
                {getStatusChip(study.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {studies.length > 0 && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="caption" sx={{ color: "#666" }}>
            💡 Tip: Only select studies with "Analyzed" status for creation.
            Uncheck studies you don't want to create.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default StudiesTable;

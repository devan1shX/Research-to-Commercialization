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
} from "@mui/material";
import { CheckCircle, HourglassEmpty, Error } from "@mui/icons-material";

const StudiesTable = ({ studies, onSelectStudy, selectedStudyId }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case "analyzed":
        return <Chip icon={<CheckCircle />} label="Analyzed" color="success" size="small" />;
      case "analyzing":
        return <Chip icon={<HourglassEmpty />} label="Analyzing" color="warning" size="small" />;
      case "error":
        return <Chip icon={<Error />} label="Error" color="error" size="small" />;
      default:
        return <Chip label="Pending" size="small" />;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="studies table">
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studies.map((study) => (
            <TableRow
              key={study.id}
              onClick={() => onSelectStudy(study.id)}
              hover
              selected={study.id === selectedStudyId}
              sx={{ cursor: "pointer" }}
            >
              <TableCell component="th" scope="row">
                {study.file.name}
              </TableCell>
              <TableCell>{study.title || "..."}</TableCell>
              <TableCell>{getStatusChip(study.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudiesTable;
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const ActiveFilters = ({
  selectedFields,
  searchQuery,
  onClearField,
  onClearSearch,
  fields,
}) => {
  if (selectedFields.length === 0 && !searchQuery) {
    return null;
  }

  const showActiveFiltersText = selectedFields.length > 0 || searchQuery;

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2, alignItems: 'center' }}>
      {showActiveFiltersText && (
        <Typography variant="body2" sx={{ color: '#666', mr: 1 }}>
          Active filters:
        </Typography>
      )}

      {selectedFields.map((fieldValue) => {
        const field = fields.find(f => f.value === fieldValue);
        const label = field ? field.label : fieldValue;
        return (
          <Chip
            key={fieldValue}
            label={label}
            onDelete={() => onClearField(fieldValue)}
            sx={{
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
              '& .MuiChip-deleteIcon': {
                color: '#2563EB',
                '&:hover': {
                  color: '#1D4ED8',
                }
              },
            }}
          />
        );
      })}

      {searchQuery && (
        <Chip
          label={`Search: "${searchQuery}"`}
          onDelete={onClearSearch}
          sx={{
            backgroundColor: 'rgba(100, 116, 139, 0.1)',
            color: '#475569',
            '& .MuiChip-deleteIcon': {
              color: '#475569',
              '&:hover': {
                color: '#1E293B',
              }
            },
          }}
        />
      )}
    </Box>
  );
};

export default ActiveFilters;

import React from 'react';
import { FormControl, Select, MenuItem, OutlinedInput, Typography } from '@mui/material';

// Accept an 'sx' prop (aliased as passedSx to avoid conflict if sx was destructured from props)
const FieldSelector = ({ selectedFields, onFieldChange, fields, sx: passedSx }) => {
  return (
    <FormControl
      variant="outlined"
      sx={{
        // Default width (will be overridden by passedSx.width if provided)
        width: { xs: '100%', sm: '250px', md: '300px' },
        // Other existing default styles
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: 'white',
          transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, height 0.2s ease-in-out',
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563EB',
              borderWidth: '2px',
            },
          },
        },
        // Merge the passed sx prop. Styles in passedSx will override defaults if keys match.
        ...passedSx,
      }}
    >
      <Select
        multiple
        displayEmpty
        value={selectedFields}
        onChange={onFieldChange}
        input={
          <OutlinedInput
            sx={{
              borderRadius: '12px',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '0.95rem',
            }}
          />
        }
        renderValue={(selected) => {
          if (!selected || selected.length === 0) {
            return (
              <Typography
                component="em"
                sx={{
                  color: '#757575',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                }}
              >
                Genre(s)
              </Typography>
            );
          }
          if (selected.length === 1) {
            const field = fields.find(f => f.value === selected[0]);
            return (
              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '0.95rem',
                  color: '#333',
                }}
              >
                {field ? field.label : selected[0]}
              </Typography>
            );
          }
          return (
            <Typography
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.95rem',
                color: '#333',
              }}
            >
              {`${selected.length} fields selected`}
            </Typography>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 240,
              width: 250, // This width is for the dropdown menu, not the selector input itself
            },
          },
        }}
        sx={{
          '& .MuiSelect-select': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          '& .MuiSelect-icon': {
            color: '#666',
          },
        }}
      >
        {fields.map((field) => (
          <MenuItem
            key={field.value}
            value={field.value}
            sx={{
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(37, 99, 235, 0.12) !important',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.15) !important',
                },
              },
            }}
          >
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FieldSelector;
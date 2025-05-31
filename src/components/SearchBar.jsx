import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchQuery, onSearchChange, placeholder }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchQuery}
      onChange={onSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#666', fontSize: '22px' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: 'white',
          paddingLeft: '16px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
            borderWidth: '2px',
          }
        },
        '& .MuiOutlinedInput-input': {
          paddingLeft: '12px',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: '0.95rem',
          '&::placeholder': {
            color: '#999',
            opacity: 1,
          }
        }
      }}
    />
  );
};

export default SearchBar;

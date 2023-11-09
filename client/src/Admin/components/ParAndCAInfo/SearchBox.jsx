import styled from '@emotion/styled'
import { alpha, Box, Button, IconButton, Input, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  border: `1px solid ${theme.palette.secondary.light}`,
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  display: 'grid',
  gridTemplateColumns: '30px auto',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),

    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const SearchBox = ({
  value,
  handleSearchChange,
  handleSearch,
  children,
  placeholder,
}) => {
  return (
    <Search
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
    >
      <IconButton
        aria-label='search'
        sx={{
          height: '100%',
          width: '100%',
          padding: '5px 20px',
        }}
      >
        <SearchIcon />
      </IconButton>
      <StyledInputBase
        variant='standard'
        placeholder={placeholder || 'search text'}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={handleSearchChange}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '105%',
          left: 0,
          width: '100%',
          height: 'auto',
          zIndex: '200',
        }}
      >
        {children}
      </Box>
    </Search>
  )
}

export default SearchBox

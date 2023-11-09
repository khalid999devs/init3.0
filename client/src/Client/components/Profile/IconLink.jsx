import { Stack, Typography } from '@mui/material'
import React from 'react'

export const IconLink = ({ icon, label, onClick }) => {
  return (
    <Stack
      alignItems={'center'}
      rowGap={0.5}
      sx={{
        padding: '5px 15px',
        opacity: '.8',
        cursor: 'pointer',
        userSelect: 'none',
        border: '1px solid rgba(0,0,0,.15)',
        borderRadius: '5px',
        transform: 'scale(.8)',
        '&:hover': {
          opacity: 1,
          border: (theme) => `1px solid ${theme.palette.darkBlue.main}`,
          transform: 'scale(.8)',
        },
      }}
      onClick={onClick}
    >
      {icon}
      <Typography
        textTransform={'uppercase'}
        fontSize={'.8rem'}
        color={'darkBlue.main'}
      >
        {label}
      </Typography>
    </Stack>
  )
}

export default IconLink

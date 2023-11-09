import { Stack, Typography } from '@mui/material'

const IconInfo = ({ icon, label, info, columnGap }) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      columnGap={columnGap || 0.5}
    >
      {icon}
      <Typography fontSize={'1.1rem'} ml={0.8}>
        {label}
      </Typography>
      {info && (
        <Typography
          sx={{ fontWeight: '500', color: 'secondary.main' }}
          fontSize={'1.1rem'}
        >
          {info}
        </Typography>
      )}
    </Stack>
  )
}

export default IconInfo

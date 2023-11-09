import { Box, Typography } from '@mui/material'

export const UnderlinedTypo = ({ text, color, variant, underlined, align }) => {
  return (
    <Box
      sx={{
        textAlign: align || 'left',
        paddingTop: (theme) => theme.spacing(1),
        paddingBottom: (theme) => theme.spacing(1),
      }}
    >
      <Typography
        variant={variant}
        sx={{
          fontWeight: 400,
          color: color,
          borderBottom: underlined ? '1px solid ' : '',
          textAlign: 'left',
          letterSpacing: (theme) => theme.spacing(0.2),
        }}
        component='span'
      >
        {text}
      </Typography>
    </Box>
  )
}

export const InfoTypography = ({ label, info, color, breakw }) => {
  return (
    <Typography
      sx={{
        fontFamily: 'Titillium Web, sans-serif',
        lineHeight: '1.2rem',
        fontWeight: '600',
        wordBreak: !breakw ? 'break-word' : 'break-all',
      }}
      variant='body'
      component={'span'}
    >
      {label}
      {' : '}
      <Typography
        variant='body'
        color={color ? color : 'info.main'}
        component={'span'}
        pl={1}
      >
        {info}
      </Typography>
    </Typography>
  )
}

export const SplitTypography = ({ infos, title }) => {
  return (
    <Typography mt={1} align='left' variant='body2' color='text.secondary'>
      <b>{title} :</b>
      <br />
      {infos &&
        infos.split(',').map((data, value) => {
          return (
            <Typography
              component={'span'}
              variant='body2'
              fontStyle={'italic'}
              key={value}
              color='darkBlue.main'
            >
              {data}
              {' , '}
            </Typography>
          )
        })}
    </Typography>
  )
}

export const ChangeTypo = ({ initial, final }) => {
  return (
    <Typography
      width={'100%'}
      fontSize={'.85rem'}
      color={'secondary.light'}
      letterSpacing={'1px'}
    >
      {initial}{' '}
      {final && (
        <Typography
          component={'span'}
          fontWeight={'500'}
          fontSize={'.85rem'}
          color={'secondary.main'}
          letterSpacing={'1px'}
        >
          -{'>'}&nbsp; {final}
        </Typography>
      )}
    </Typography>
  )
}

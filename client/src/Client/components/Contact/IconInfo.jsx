import { Stack, Typography } from '@mui/material'

const IconInfo = ({ icon, items }) => {
  return (
    <Stack justifyCOntent={'flex-start'}>
      {icon}
      <Stack>
        {items.split(',').map((item, key) => {
          return item ? (
            <Typography
              key={key}
              sx={{
                opacity: '.8',
                letterSpacing: spacing || 'initial',
                fontWeight: '400',
              }}
              variant='subtitle2'
              component={'span'}
            >
              {item}
            </Typography>
          ) : (
            ''
          )
        })}
      </Stack>
    </Stack>
  )
}

export default IconInfo

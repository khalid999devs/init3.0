import { Checkbox, Stack, Typography } from '@mui/material'

const CheckBox = ({ checked, onChange, text }) => {
  return (
    <Stack flexDirection={'row'} alignItems={'center'}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{ '& .MuiSvgIcon-root': { fontSize: 20, color: 'info.main' } }}
      />
      <Typography
        align='center'
        color={'semiWhite.main'}
        fontFamily={`'Titillium Web', sans-serif`}
        component={'div'}
      >
        {text || 'I agree to the terms and cookies'}
      </Typography>
    </Stack>
  )
}

export default CheckBox

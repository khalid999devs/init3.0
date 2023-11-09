import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: `1px 1px 15px 2px rgba(0, 0, 0,0.3)`,
  margin: `10px`,
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
}))

import styled from '@emotion/styled'
import { Input } from '@mui/material'

export const StyledInput = styled(Input)(({ theme }) => ({
  backgroundColor: theme.palette.semiWhite.main,
  padding: theme.spacing(1),
  transition: '.5s ease all',
  '&:focus': {
    border: `1px solid ${theme.palette.info}`,
  },
  fontSize: '14px',
  letterSpacing: '.9px',
  outline: 'none',
  borderRadius: '5px',
  fontWeight: 500,
}))

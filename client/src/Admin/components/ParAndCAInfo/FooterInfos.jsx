import { Box } from '@mui/material'
import styled from '@emotion/styled'

export const FooterFixedBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
  color: theme.palette.semiWhite.main,
  width: 'inherit',
  backgroundColor: theme.palette.primary.light,
  left: '50%',
  transform: 'translate(-50%,0)',
  padding: '0 10px 0 80px',
  [theme.breakpoints.up('xl')]: {
    padding: 0,
  },
}))

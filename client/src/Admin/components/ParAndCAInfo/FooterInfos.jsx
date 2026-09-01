import { Box } from '@mui/material'
import styled from '@emotion/styled'

export const FooterFixedBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
  color: theme.palette.semiWhite.main,
  width: '100%',
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1.5, 1.5, 0, 0),
  boxShadow: '0 -8px 24px rgba(20, 24, 38, .12)',
}))

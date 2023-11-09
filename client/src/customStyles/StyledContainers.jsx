import styled from '@emotion/styled'
import { Container } from '@mui/material'

export const StyledAdminContainer = styled(Container)(({ theme }) => ({
  padding: '0 10px 0 80px',
  [theme.breakpoints.up('xl')]: {
    padding: '0',
  },
}))

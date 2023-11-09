import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.info.main,
  textDecoration: 'none',
  wordBreak: 'break-word',
  transition: '.3s ease all',

  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.info.light,
  },
}))

export const RouterStyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.info.main,
  textDecoration: 'none',
  wordBreak: 'break-word',

  '&:hover': {
    color: theme.palette.info.main,
  },
}))

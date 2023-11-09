import { Button, Link } from '@mui/material'
import styled from '@emotion/styled'

export const SmallInfoButton = styled(Button)({
  fontSize: '11px',
  padding: '2px',
  display: 'inline',
  margin: '1px',
  // '&:hover': {
  //   border: 'initial',
  // },
})

export const LinkedButton = ({ link, color, text }) => {
  return (
    <Link
      target={'_blank'}
      href={link}
      sx={{ textDecoration: 'none', maxWidth: 'max-content' }}
    >
      <Button
        variant='outlined'
        sx={{ borderRadius: 0, color: color || 'darkBlue.main' }}
      >
        {text}
      </Button>
    </Link>
  )
}

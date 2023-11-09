import { Box, Button, Container, Typography } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

const PError = () => {
  return (
    <Container
      maxWidth='lg'
      sx={{
        minHeight: '600px',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        }}
      >
        <LazyLoadImage
          src='/Images/404.png'
          width={'100%'}
          effect={'blur'}
          style={{ objectFit: 'cover' }}
        />
        <Box
          width={'100%'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            fontSize={'7rem'}
            fontFamily={`'Titillium Web', sans-serif`}
            fontWeight={'900'}
            color={'secondary'}
          >
            Oops!
          </Typography>
          <Typography
            fontFamily={`'Titillium Web', sans-serif`}
            fontWeight={'600'}
            fontSize={'1rem'}
            sx={{
              width: {
                xs: '95%',
                sm: '80%',
              },
              color: 'secondary.light',
              marginLeft: '10px',
            }}
          >
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable
          </Typography>
          <Link
            to='/'
            replace={true}
            style={{
              textDecoration: 'none',
              transform: 'translateY(30px)',
              marginLeft: '12px',
            }}
          >
            <Button
              variant='contained'
              color='darkBlue'
              sx={{
                borderRadius: 0,
                color: 'semiWhite.main',
              }}
            >
              GO TO HOMEPAGE
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  )
}

export default PError

import { GlobalContextConsumer } from '../../../GlobalContext'
import { reqImgWrapper } from '../../../data/requests'
import { Box, Button, Container, Typography } from '@mui/material'
import Notices from './Notices'
import { useNavigate } from 'react-router-dom'
import { ClientContextConsumer } from '../../pages/Client'

const Banner = () => {
  const { appSetting } = GlobalContextConsumer()
  const { title, titleDesc } = appSetting
  const {
    clientProfile: { id },
  } = ClientContextConsumer()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: {
          xs: '700px',
          md: '900px',
        },
        height: '100vh',
        width: '100%',
        backgroundImage: `url('${
          appSetting.image
            ? reqImgWrapper(appSetting.image).replaceAll('\\', '/')
            : '/Images/mBanner.jpg'
        }')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'center',
        backgroundPosition: 'center',
        position: 'relative',
        '&::after': {
          zIndex: '0',
          backgroundColor: 'rgba(0,0,0,.85)',
          content: `''`,
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          width: '100%',
        },
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.5fr 1fr',
          },
          height: '100%',
          p: 1,
        }}
      >
        <Box
          sx={{
            borderLeft: '1px solid rgba(255,255,255,.15)',
            borderRight: '1px solid rgba(255,255,255,.15)',
            paddingTop: {
              xs: '35%',
              sm: '25%',
            },
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              maxHeight: '400px',
              height: 'min-content',
              pl: 1,
              position: 'relative',
              zIndex: '2',
              '&::after': {
                content: `''`,
                position: 'absolute',
                height: '100%',
                width: '30%',
                zIndex: '-1',
                backgroundColor: 'darkBlue.main',
                opacity: '.5',
                top: '0',
                left: '0',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.4rem', lg: '1.6rem' },
                WebkitTextStroke: (theme) => `1px ${theme.palette.info.main}`,
                WebkitTextFillColor: 'rgba(0,0,0,.2)',
              }}
              color={'info.main'}
              lineHeight='5px'
              textTransform={'uppercase'}
              letterSpacing='3px'
            >
              welcome to
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '3.8rem', xsm: '5rem', sm: '6rem', lg: '9rem' },
                fontFamily: `'Titillium Web', sans-serif`,
                fontWeight: 'bolder',
              }}
              color={'semiWhite.main'}
              textTransform='uppercase'
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              marginTop: titleDesc.length > 250 ? '11%' : '15%',
              borderLeft: (theme) => `5px solid ${theme.palette.info.main}`,
            }}
          >
            <Typography
              color={'semiWhite.light'}
              sx={{
                width: {
                  xs: '75%',
                  xsm: '70%',
                  sm: '60%',
                  lg: '70%',
                },
                backgroundColor: 'rgba(0,0,0,.3)',
                opacity: 0.9,
              }}
              letterSpacing='1.2px'
              fontWeight={'400'}
              pl={2}
              fontSize='.9rem'
            >
              {titleDesc}
            </Typography>
          </Box>

          {/* register button */}
          {!id && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: {
                  xs: 'center',
                  md: 'flex-end',
                },
                marginTop: { xs: '120px', md: '150px' },
              }}
            >
              <Button
                variant='filled'
                color='info.main'
                sx={{
                  width: 'max-content',
                  backdropFilter: 'blur(3px)',
                  borderRadius: 0,
                  backgroundColor: 'info.main',
                  color: 'primary.main',
                  fontSize: '1.2rem',
                  border: (theme) => `2px solid ${theme.palette.info.main}`,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'info.main',
                    borderColor: 'info.main',
                    cursor: 'pointer',
                  },
                  textTransform: 'capitalize',
                }}
                disabled={id ? true : false}
                onClick={() => {
                  navigate('/registration/participant')
                }}
              >
                Register Now!
              </Button>
            </Box>
          )}
        </Box>
        <Notices />
      </Container>
    </Box>
  )
}

export default Banner

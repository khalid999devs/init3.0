import { GlobalContextConsumer } from '../../../GlobalContext'
import { Box, Container, IconButton, Modal, Typography } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { reqImgWrapper } from '../../../data/requests'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useState } from 'react'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import { introDesc } from '../../../data/client'

const Intro = ({ homeData }) => {
  const {
    appSetting: { intro, image },
  } = GlobalContextConsumer()
  const [vidOpen, setVidOpen] = useState(false)

  return (
    <>
      {intro && (
        <Container
          maxWidth='lg'
          sx={{
            minHeight: '700px',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              height: { xs: '90%', md: '70%' },
              gridTemplateColumns: {
                xs: 'auto',
                md: '2fr 3fr',
              },
              pt: 5,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                paddingLeft: { xs: '1%', md: '5%' },
                display: 'flex',
                flexDirection: 'column',
                rowGap: '10%',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h4'
                color={'primary.main'}
                sx={{
                  fontSize: '2.1rem',
                  fontFamily: `'Titillium Web', sans-serif`,
                  fontWeight: '600',
                  textTransform: 'upperCase',
                  zIndex: '5',
                  WebkitTextStroke: (theme) =>
                    `1px ${theme.palette.primary.main}`,
                  WebkitTextFillColor: (theme) => theme.palette.darkBlue.main,
                }}
              >
                Let's watch the intro!!
              </Typography>
              <Typography
                letterSpacing='.7px'
                color={'secondary.light'}
                sx={{
                  fontSize: '1rem',
                  transform: 'translateY(-10%)',
                  width: { xs: '100%', md: '90%' },
                }}
              >
                {homeData.introDesc || introDesc}
              </Typography>
            </Box>
            <Box
              sx={{
                maxWidth: '100%',
                width: '100%',
                position: 'relative',

                '&::after': {
                  position: 'absolute',
                  content: `''`,
                  height: { xs: '50px', md: '110%' },
                  width: { xs: '105%', md: '50px' },
                  backgroundColor: 'body.main',
                  left: { xs: '-3%', md: '-3%' },
                  top: '-5%',
                  zIndex: '2',
                  transform: { xs: 'skew(0deg,-3deg)', md: 'skew(3deg,0deg)' },
                },
              }}
            >
              <LazyLoadImage
                style={{ objectFit: 'cover', opacity: '.6' }}
                height='100%'
                width='100%'
                effect='blur'
                src={image && reqImgWrapper(image)}
                alt='Logo'
              />
              <IconButton
                disableRipple
                sx={{
                  position: 'absolute',
                  zIndex: '5',
                  width: '100px',
                  height: '80px',
                  top: { xs: '12%', sm: '8%', md: '50%' },
                  left: { xs: '50%', md: '5%' },
                  borderRadius: '0',
                  border: (theme) =>
                    `5px solid ${theme.palette.secondary.main}`,
                  transform: 'translate(-50%,-50%)',
                  fontSize: '4rem',
                  color: 'secondary.main',
                  transition: `.3s ease-in-out all`,
                  backdropFilter: 'blur(3px)',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'info.light',
                  },
                }}
                onClick={() => setVidOpen(true)}
              >
                <PlayArrowIcon fontSize='5rem' sx={{}} />
              </IconButton>
            </Box>
          </Box>
          {/* video modal */}
          <Modal
            open={vidOpen}
            onClose={() => setVidOpen(false)}
            aria-labelledby='Intro video'
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '700px',
                height: '100vh',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',

                '& iframe': {
                  transition: '.3s ease all',
                  height: {
                    xs: '60%',
                    md: '80%',
                    lg: '90%',
                  },
                },
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: 'semiWhite.main',
                  color: 'primary.main',
                  position: 'fixed',
                  top: '3%',
                  right: '2%',
                  transition: '.3s ease all',
                  borderRadius: '0',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'semiWhite.main',
                  },
                }}
                onClick={() => setVidOpen(false)}
              >
                <CloseOutlined />
              </IconButton>
              <iframe
                width='100%'
                src={`${intro}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;'
                allowFullScreen
              ></iframe>
            </Box>
          </Modal>
        </Container>
      )}
    </>
  )
}

export default Intro

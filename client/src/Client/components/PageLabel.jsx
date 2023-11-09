import { Box, Container, keyframes, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { GlobalContextConsumer } from '../../GlobalContext'
import { reqImgWrapper } from '../../data/requests'

const StyledLabelBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '350px',
  height: '50vh',
  backgroundPosition: 'center',
  backgroundOrigin: 'center',
  backgroundSize: 'cover',
}))

const letterAnimation = keyframes`
from{
    transform: scaleX(0);
  }
  to{
    transform: scaleX(1);
  }
`

const PageLabel = ({ label, bgImg, color, fontSize }) => {
  const {
    appSetting: { image },
  } = GlobalContextConsumer()

  return (
    <StyledLabelBox
      sx={{
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8) 100%, rgba(0, 0, 0, 0.8)100%), url("${
          bgImg
            ? bgImg
            : image
            ? reqImgWrapper(image).replaceAll('\\', '/')
            : 'Images/mBanner.jpg'
        }")`,

        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {label && (
          <Typography
            align='left'
            sx={{
              fontSize: fontSize || { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bolder',
              textTransform: 'uppercase',
              color: color || 'semiWhite.main',
              padding: '0px 20px',
              position: 'relative',
              lineHeight: { xs: '4rem', md: '6.5rem' },
              zIndex: 1,
              animation: `${letterAnimation} 1s forwards cubic-bezier(0.47, 0.4, 0.26, 0.84)`,

              '&::after': {
                content: `''`,
                position: 'absolute',
                left: 0,
                width: '40%',
                top: 0,
                height: '100%',
                backgroundColor: 'darkBlue.main',
                opacity: '.6',
                zIndex: -1,
              },
            }}
            className='label-typo'
          >
            {label}
          </Typography>
        )}
      </Container>
    </StyledLabelBox>
  )
}

export default PageLabel

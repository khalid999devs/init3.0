import styled from '@emotion/styled'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router-dom'

const StyledTypoBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: '500px',
  },
}))

const StyledTypoBr = styled('br')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const StyledImgContainer = styled(Box)(({ theme }) => ({
  maxWidth: '300px',
  width: '100%',
  maxHeight: 'auto',

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const Info = ({ homeData }) => {
  const [isReached, setIsReached] = useState(false)
  const infoEl = useRef('')
  const navigate = useNavigate()

  const handleScroll = (el) => {
    const elYPos = el.offsetTop
    if (elYPos) {
      if (
        window.scrollY >= elYPos - 300 &&
        window.scrollY <= elYPos + (2.5 / 5) * el.offsetHeight
      ) {
        isReached === false && setIsReached(true)
      } else {
        isReached === true && setIsReached(false)
      }
    }
  }
  useEffect(() => {
    const el = infoEl.current
    if (el) window.addEventListener('scroll', () => handleScroll(el))
    return () => window.removeEventListener('scroll', () => handleScroll(el))
  }, [isReached])

  const BigTypo = styled(Typography)(({ theme }) => ({
    fontSize: '5rem',
    fontWeight: '600',
    letterSpacing: '2px',
    WebkitTextStroke: `2px ${
      isReached ? theme.palette.semiWhite.light : theme.palette.darkBlue.main
    }`,
    WebkitTextFillColor: `transparent`,
    lineHeight: '6rem',
  }))
  return (
    <Box
      ref={infoEl}
      sx={{
        width: '100%',
        minHeight: { md: '100vh' },
        bgcolor: isReached ? 'primary.main' : 'body.main',
        transition: '.3s linear all',
        padding: '0 20px',
        paddingBottom: { xs: '100px', md: 0 },
      }}
    >
      <Box
        sx={{
          height: '100%',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          pt: '100px',
          position: 'relative',
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: 'row-reverse', md: 'row' },
            justifyContent: { xs: 'flex-end', md: 'center' },
            maxWidth: { xs: '500px', md: '100%' },
            width: '100%',
            margin: { xs: '0 auto', md: 0 },
          }}
          columnGap={5}
        >
          <StyledTypoBox pt={2}>
            <BigTypo align='left'>
              <span style={{ textTransform: 'capitalize' }}>What </span>
              <StyledTypoBr />
              <Typography
                component={'span'}
                sx={{ marginRight: { xs: '0', md: '30px' } }}
              ></Typography>
              do <br /> we <StyledTypoBr />
              <Typography
                component={'span'}
                sx={{ marginRight: { xs: '0', md: '40px' } }}
              ></Typography>
              do?
            </BigTypo>
          </StyledTypoBox>
          <StyledImgContainer>
            <LazyLoadImage
              style={{ objectFit: 'cover' }}
              width='100%'
              height={'100%'}
              src='Images/info/info1.jpg'
              alt='info1'
              effect='blur'
            />
          </StyledImgContainer>
        </Stack>
        <Stack
          width='100%'
          sx={{ flexDirection: { xs: 'row-reverse', md: 'row' } }}
          columnGap={2}
          justifyContent='center'
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              maxWidth: '350px',
              width: '100%',
              minHeight: '600px',
              alignItems: 'center',
            }}
          >
            <LazyLoadImage
              style={{ objectFit: 'cover' }}
              width={'100%'}
              src='Images/info/info2.jpg'
              alt='info2'
              effect='blur'
            />
          </Box>
          <Box
            sx={{
              paddingTop: '50px',
              display: 'flex',
              alignItems: 'center',

              flexDirection: 'column',
              maxWidth: '500px',
              width: '100%',
              position: 'relative',
              '&::after': {
                position: 'absolute',
                content: `''`,
                height: '120px',
                width: '15px',
                backgroundColor: 'info.main',
                left: '-0%',
                top: '4%',
                opacity: '.8',
                display: {
                  xs: 'none',
                  md: 'inline-block',
                },
              },
            }}
          >
            <Typography
              sx={{
                width: { md: '80%' },
                fontSize: '1.1rem',
                paddingRight: '5%',
                color: (theme) =>
                  `${
                    isReached
                      ? theme.palette.semiWhite.light
                      : theme.palette.primary.main
                  }`,
                fontWeight: isReached ? 'light' : 'normal',
                letterSpacing: '1px',
                opacity: '.8',
                paddingRight: { xs: '2rem', md: 0 },
              }}
            >
              {homeData.infoDesc ||
                ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              natus id excepturi ex. Facere eos fugiat necessitatibus aliquid!
              Dolore iure eligendi doloremque possimus distinctio reiciendis
              dolor odio sunt quidem neque. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Impedit vero quae labore, laborum
              sed esse. Et, enim? Facilis, porro quod.`}
            </Typography>
            <Button
              sx={{
                width: 'max-content',
                borderRadius: 0,
                transform: {
                  xs: 'translate(0,30px)',
                  md: 'translate(50px,50px)',
                },
                alignSelf: 'flex-start',
              }}
              variant='outlined'
              color='info'
              onClick={() => {
                navigate('/about', { replace: true })
              }}
            >
              see more
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Info

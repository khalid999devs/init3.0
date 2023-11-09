import { useEffect, useState } from 'react'
import PageLabel from '../components/PageLabel'
import { Box, Container, Stack, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { GlobalContextConsumer } from '../../GlobalContext'
import { reqImgWrapper } from '../../data/requests'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { LinkedButton } from '../../global_components/Buttons'
import ReactMarkdown from 'react-markdown'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  maxWidth: '1000px',
  margin: '100px auto',
  width: '100%',
  columnGap: '40px',
}))

const StyledListContainer = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  '& li': {
    color: theme.palette.secondary.light,
    fontSize: { xs: '.9rem', md: '1.1rem' },

    marginBottom: '20px',
    paddingLeft: '5px',
    marginLeft: '20px',
    position: 'relative',
    fontFamily: `'Roboto', sans-serif`,
  },
  '& li::marker': {
    content: `"➔"`,
    fontSize: '1.1rem',
    fontWeight: 'bolder',
    color: theme.palette.darkBlue.main,
  },
}))

const About = () => {
  const {
    appSetting: { image },
  } = GlobalContextConsumer()
  const [about, setAbout] = useState({
    rules: [],
    fests: [],
    club: {},
  })

  const getData = async () => {
    try {
      const data = await fetch('json/about.json')
      const objData = await data.json()
      if (objData) setAbout(objData)
    } catch (error) {
      // console.log(error)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <PageLabel label={'about us'} />
      <Container maxWidth='lg' sx={{ paddingTop: '100px' }}>
        {/* rules */}
        {about.rules.length > 0 && (
          <Stack
            sx={{
              maxWidth: (theme) => theme.breakpoints.values.md,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <Typography
              color={'secondary.main'}
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                lineHeight: { xs: '3rem', md: '3.5rem' },
              }}
              textTransform='uppercase'
              fontWeight={'bolder'}
            >
              General rules &<br /> regulations
            </Typography>
            <Box
              mt={4}
              sx={{
                display: 'flex',
                columnGap: '20px',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'inline',
                  },
                  maxWidth: '200px',
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'secondary.light',
                  opacity: '.7',
                }}
              />
              <Box sx={{ maxWidth: '650px' }}>
                <StyledListContainer>
                  {about.rules.map((rule, key) => {
                    return (
                      <li key={key}>
                        <ReactMarkdown>{rule}</ReactMarkdown>
                      </li>
                    )
                  })}
                </StyledListContainer>
              </Box>
            </Box>
          </Stack>
        )}

        {/* current fests */}
        {about.fests.map((fest, key) => {
          return (
            <StyledBox
              key={key}
              sx={{
                flexDirection: {
                  xs: 'column',
                  md: key % 2 == 0 ? 'row' : 'row-reverse',
                },
              }}
            >
              <Box
                sx={{
                  minWidth: { xs: '300px', md: '450px' },
                  minHeight: '300px',
                  position: 'relative',
                  '&::after': {
                    content: `''`,
                    position: 'absolute',
                    top: '100%',
                    left: key % 2 == 0 ? '0' : '99.7%',
                    width: '2px',
                    height: '70px',
                    backgroundColor: 'darkBlue.main',
                    opacity: '.7',
                    display: { xs: 'none', md: 'inline-block' },
                  },
                }}
              >
                <LazyLoadImage
                  src={!fest.image ? reqImgWrapper(image) : fest.image}
                  style={{ objectFit: 'fill' }}
                  alt={fest.title}
                  effect='blur'
                  width={'100%'}
                  height={'100%'}
                />
              </Box>
              <Box>
                <Typography
                  variant='h2'
                  color={'secondary.main'}
                  textTransform='uppercase'
                  fontWeight={'bolder'}
                >
                  {fest.title}
                </Typography>
                <Typography
                  sx={{
                    pl: 4,
                    position: 'relative',
                    '&::after': {
                      position: 'absolute',
                      content: `''`,
                      left: '1%',
                      width: '10px',
                      height: '30px',
                      top: '-5%',
                      backgroundColor: 'info.main',
                    },
                  }}
                  variant='body1'
                  mt={3}
                  color={'secondary.light'}
                >
                  {fest.desc}
                </Typography>
              </Box>
            </StyledBox>
          )
        })}
        <Stack justifyContent={'center'} alignItems='center'>
          <LinkedButton link={'https://nditc.org'} text='more about us' />
        </Stack>
      </Container>
    </>
  )
}

export default About

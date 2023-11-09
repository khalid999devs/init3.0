import styled from '@emotion/styled'
import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { reqImgWrapper } from '../../data/requests'
import { GlobalContextConsumer } from '../../GlobalContext'
import { RegFormRules, tutorialVideoLink } from '../../data/client'
import RegistrationForm from '../components/Forms/RegistrationForm'
import { RouterStyledLink, StyledLink } from '../../customStyles/StyledLinks'
import { ClientContextConsumer } from './Client'
import { useState } from 'react'
import { CustomSnackBar, PermanentAlert } from '../../global_components/Alerts'
import { useEffect } from 'react'

const StyledUL = styled('ul')(({ theme }) => ({
  margin: '20px 0 20px 0',
  paddingLeft: theme.spacing(3),
  fontFamily: `'Titillium Web', sans-serif`,
  fontWeight: '600',
  fontSize: '1rem',
  '& li': {
    margin: '5px 0',
    color: theme.palette.semiWhite.light,
    paddingLeft: '5px',
    opacity: 0.9,
    letterSpacing: '1px',
    [theme.breakpoints.down('md')]: {
      color: theme.palette.primary.main,
      fontSize: '1rem',
    },
    wordBreak: 'break-word',
  },
  '& li::marker': {
    content: `"➔"`,
    color: theme.palette.warning.main,
    fontSize: '1.2rem',
    fontWeight: 'bolder',
  },
}))

const Registration = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mode } = useParams()
  const [redirectEvent, setRedirectEvent] = useState({
    event: searchParams.get('rd') || null,
    team: searchParams.get('type') || null,
  })
  const {
    clientProfile: { userName, fullName },
  } = ClientContextConsumer()

  const {
    appSetting: { image, caRegPermit, parRegPermit },
  } = GlobalContextConsumer()

  useEffect(() => {
    if (caRegPermit === false && mode === 'ca') {
      navigate(`/registration/participant`)
    }
  }, [caRegPermit])

  const [snackBar, setSnackBar] = useState(false)
  return (
    <>
      <Container
        sx={{ paddingTop: { xs: '80px', md: '100px' }, minHeight: '100vh' }}
        maxWidth={'lg'}
      >
        {/* for tutorial link */}
        <PermanentAlert />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr minmax(200px, 1.4fr)' },
            maxWidth: '1000px',
            width: '100%',
            minHeight: {
              xs: '450px',
              md: '550px',
            },
            boxShadow: '1px 1px 5px 1px rgba(0,0,0,.3)',

            backgroundImage: {
              xs: 'none',
              md: `linear-gradient( rgba(0, 0, 0, 0.9) 100%, rgba(0, 0, 0, 0.7)100%), url("${
                image
                  ? reqImgWrapper(image).replaceAll('\\', '/')
                  : 'Images/mBanner.jpg'
              }")`,
            },
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            margin: '20px auto 10px auto',
          }}
        >
          <Stack
            p={3}
            sx={{
              alignItems: {
                xs: 'center',
                md: 'flex-start',
              },
              justifyContent: 'space-between',
            }}
          >
            <Stack
              rowGap={5}
              sx={{
                rowGap: {
                  xs: 2,
                  md: 5,
                },
                width: 'fit-content',
              }}
            >
              <Typography
                textTransform={'capitalize'}
                color={'semiWhite.main'}
                fontWeight={'500'}
                sx={{
                  lineHeight: '4rem',
                  color: {
                    xs: 'secondary.main',
                    md: 'semiWhite.main',
                  },
                  fontSize: {
                    xs: '2.8rem',
                    xsm: '3.5rem',
                    sm: '4rem',
                    md: '3.5rem',
                  },
                  textAlign: {
                    xs: 'left',
                    md: 'center',
                  },
                }}
              >
                Create Account
              </Typography>

              <StyledUL>
                <li>
                  We recommend you watch this tutorial video before you fill up
                  this form:{' '}
                  <StyledLink
                    href={tutorialVideoLink}
                    target='_blank'
                    style={{
                      textDecoration: 'underline',
                      letterSpacing: '1px',
                    }}
                  >
                    {tutorialVideoLink}
                  </StyledLink>
                </li>
                {RegFormRules.map((rule, key) => {
                  return rule ? <li key={key}>{rule}</li> : ''
                })}
              </StyledUL>
            </Stack>
            <Stack alignItems={'center'} width={'100%'}>
              <IconButton
                sx={{
                  borderRadius: 0,
                  border: (theme) => ({
                    xs: `1px solid ${theme.palette.darkBlue.main}`,
                    md: `1px solid ${theme.palette.info.main}`,
                  }),
                  width: 'max-content',
                  justifySelf: 'center',
                  margin: '25px 0',
                  opacity: 0.7,
                  transition: '.5s ease all',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={(_) => {
                  window.navigator.clipboard.writeText(window.location.href)
                  setSnackBar(true)
                }}
              >
                <ShareIcon
                  sx={{
                    fontSize: '1.5rem',
                    color: {
                      xs: 'darkBlue.main',
                      md: 'info.main',
                    },
                  }}
                />
              </IconButton>
              <Typography
                fontSize={'1rem'}
                fontFamily={`'Titillium Web', sans-serif`}
                align='center'
                sx={{
                  letterSpacing: '.9px',
                  color: {
                    xs: 'secondary.main',
                    md: 'semiWhite.main',
                  },
                  fontWeight: { xs: '600' },
                  '& a': {
                    color: { xs: 'darkBlue.main', md: 'info.main' },
                  },
                }}
              >
                Already registered ?&nbsp;&nbsp;
                <RouterStyledLink
                  style={{
                    fontWeight: '600',
                    letterSpacing: '.8px',
                    textDecoration: 'underline',
                  }}
                  to={'/login?rd=0'}
                >
                  Log In
                </RouterStyledLink>
                <br />
                {userName && fullName && (
                  <>
                    Or continue as &nbsp;&nbsp;
                    <RouterStyledLink
                      style={{ letterSpacing: '.8px' }}
                      to={`/profile/${userName}`}
                    >
                      {fullName}
                    </RouterStyledLink>
                    <br />
                  </>
                )}
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              p: 4,
            }}
          >
            {!parRegPermit ? (
              <Typography
                fontSize={'1.2rem'}
                fontWeight={'bolder'}
                align='center'
                color={'lightBlue'}
              >
                Registration period expired
              </Typography>
            ) : (
              <RegistrationForm mode={mode} redirectEvent={redirectEvent} />
            )}
          </Box>
        </Box>
      </Container>
      {/* snackbar */}
      <CustomSnackBar
        open={snackBar}
        onClose={(_) => setSnackBar(false)}
        duration={2500}
      />
    </>
  )
}

export default Registration

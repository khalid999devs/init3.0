import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import reqs, { reqImgWrapper } from '../../data/requests'
import { GlobalContextConsumer } from '../../GlobalContext'
import { CustomSnackBar } from '../../global_components/Alerts'
import { ClientContextConsumer } from './Client'
import ShareIcon from '@mui/icons-material/Share'
import styled from '@emotion/styled'
import {
  TeamFormRules,
  SingleFormRules,
  paidEventRulesLink,
  teamBasedEventLink,
} from '../../data/client'
import SoloForm from '../components/ParticipationForms/SoloForm'
import TeamForm from '../components/ParticipationForms/TeamForm'
import { CustomModal } from '../../global_components/Modals'
import { StyledLink } from '../../customStyles/StyledLinks'

const StyledUL = styled('ul')(({ theme }) => ({
  margin: '20px 0 20px 0',
  paddingLeft: theme.spacing(3),
  fontFamily: `'Titillium Web', sans-serif`,
  fontWeight: '600',
  fontSize: '1rem',

  '& li': {
    margin: '5px 0',
    color: theme.palette.semiWhite.main,
    paddingLeft: '5px',
    opacity: 0.9,
    letterSpacing: '.85px',
    wordBreak: 'break-word',
    [theme.breakpoints.down('md')]: {
      color: theme.palette.primary.main,
    },
  },
  '& li::marker': {
    content: `"➔"`,
    color: theme.palette.warning.main,
    fontSize: '1.2rem',
    fontWeight: 'bolder',
  },
}))

const ParticipationForm = () => {
  const { type, eventValue } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [targetEvent, setTargetEvent] = useState({})
  const [alertModal, setAlertModal] = useState({
    state: false,
    msg: '',
    severity: '',
    handleClose: () => {},
  })
  const [snackBar, setSnackBar] = useState(false)
  const [loading, setLoading] = useState({ state: false, msg: '' })

  const {
    clientProfile: { userName, mode, clientEvents, fullName, email },

    clientDataLoad,
  } = ClientContextConsumer()

  const {
    appSetting: { image },
  } = GlobalContextConsumer()

  const setAlertModalToDef = () => {
    setAlertModal({
      state: false,
      msg: '',
      severity: '',
      handleClose: () => {},
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location?.pathname])

  useEffect(() => {
    if (mode === 'ca') {
      setAlertModal({
        state: true,
        msg: 'You cannot participate as a CA. Please login into your participant account or register as a participant',
        severity: 'warning',
        handleClose: () => {
          setAlertModalToDef()
          navigate(`/registration/participant`, { replace: true })
        },
      })
    }
  }, [mode])

  useEffect(() => {
    if (clientDataLoad === false) {
      if (!userName) {
        setAlertModal({
          state: true,
          msg: `Let's create an account first !!`,
          severity: 'success',
          handleClose: () => {
            setAlertModalToDef()
            navigate(
              `/registration/participant?rd=${eventValue}&type=${type}`,
              {
                replace: true,
              }
            )
          },
        })
      } else {
        if (clientEvents.includes(eventValue) && alertModal.state === false) {
          setAlertModal({
            state: true,
            msg: 'Already participated in this event. You can find the info in your profile',
            severity: 'warning',
            handleClose: () => {
              setAlertModalToDef()
              navigate(`/profile/${userName}`)
            },
          })
        } else {
          axios
            .get(`${reqs.SINGLE_EVENT}${eventValue}`)
            .then((res) => {
              if (res.data.succeed) {
                const event = res.data.result
                let submission = JSON.parse(event.submission)
                setTargetEvent({
                  ...event,
                  submission: submission,
                })
                if (!event.regPortal) {
                  setAlertModal({
                    state: true,
                    msg: 'The registration portal is currently turned off for this event.',
                    severity: 'error',
                    handleClose: () => {
                      setAlertModalToDef()
                      navigate(`/`)
                    },
                  })
                }
                if (event.team === true && type === 'solo')
                  navigate(`/404`, { replace: true })
              } else navigate(`/404`, { replace: true })
            })
            .catch((err) => {
              navigate(`/404`, { replace: true })
            })
        }
      }
    }
  }, [clientDataLoad])

  return (
    <>
      <Container
        sx={{ paddingTop: '100px', minHeight: '100vh' }}
        maxWidth={'lg'}
      >
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
              md: `linear-gradient( rgba(0, 0, 0, 0.8) 100%, rgba(0, 0, 0, 0.7)100%), url("${
                targetEvent.image
                  ? reqImgWrapper(targetEvent.image).replaceAll('\\', '/')
                  : 'Images/mBanner.jpg'
              }")`,
            },
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            margin: '50px auto',
          }}
        >
          <Stack
            p={3}
            pt={2}
            sx={{
              alignItems: {
                xs: 'center',
                md: 'flex-start',
              },
              justifyContent: 'space-between',
            }}
          >
            <Stack
              sx={{
                rowGap: {
                  xs: 2,
                  md: 4,
                },
                width: 'fit-content',
              }}
            >
              <Typography
                textTransform={'capitalize'}
                color={'semiWhite.main'}
                fontWeight={'600'}
                sx={{
                  color: {
                    xs: 'secondary.main',
                    md: 'semiWhite.main',
                  },
                  fontSize: {
                    xs: '2rem',
                    sm: '3rem',
                    md: '2.5rem',
                  },
                  textAlign: 'center',
                  wordBreak: { xs: 'break-word', xsm: 'keep-all' },
                }}
                component={'div'}
              >
                <Typography
                  sx={{
                    textTransform: 'capitalize',
                    color: 'warning.main',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                  }}
                >
                  (Participation Form)
                </Typography>
                {targetEvent.name || `Let's Participate`}
              </Typography>
              <StyledUL>
                {eventValue && (
                  <li>
                    Please make sure you read all the rules and regulations of{' '}
                    <StyledLink
                      href={`/event/${eventValue}`}
                      style={{ textDecoration: 'underline' }}
                      target='_blank'
                    >
                      {targetEvent.name || 'The Event'}
                    </StyledLink>
                  </li>
                )}
                {type === 'team' && (
                  <>
                    <li>
                      Please provide the exact email address that your teammates
                      (other members) used to{' '}
                      <StyledLink
                        href={`/registration/participant`}
                        style={{ textDecoration: 'underline' }}
                        target='_blank'
                      >
                        Register (Create Account)
                      </StyledLink>{' '}
                      in our website.
                    </li>
                    <li>
                      You can also check out this tutorial video:{' '}
                      <StyledLink
                        href={teamBasedEventLink}
                        style={{ textDecoration: 'underline' }}
                        target='_blank'
                      >
                        {teamBasedEventLink}
                      </StyledLink>
                    </li>
                    {TeamFormRules.map((rule, key) => {
                      return rule ? <li key={key}>{rule}</li> : ''
                    })}
                  </>
                )}
                {type === 'solo' &&
                  SingleFormRules.map((rule, key) => {
                    return rule ? <li key={key}>{rule}</li> : ''
                  })}
                <li>
                  For paid events, please follow the given instructions{' '}
                  <StyledLink
                    href={paidEventRulesLink}
                    style={{ textDecoration: 'underline' }}
                    target='_blank'
                  >
                    {paidEventRulesLink}
                  </StyledLink>
                </li>
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
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              p: 4,
              overflow: 'auto',
            }}
          >
            {type === 'team' ? (
              <TeamForm
                setAlertModal={setAlertModal}
                targetEvent={targetEvent}
                fullName={fullName}
                email={email}
                setAlertModalToDef={setAlertModalToDef}
                setLoading={setLoading}
                userName={userName}
              />
            ) : (
              <SoloForm
                setAlertModal={setAlertModal}
                targetEvent={targetEvent}
                fullName={fullName}
                email={email}
                setAlertModalToDef={setAlertModalToDef}
                setLoading={setLoading}
                userName={userName}
              />
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

      {/* customModal */}
      <CustomModal
        open={alertModal.state}
        handleClose={alertModal.handleClose}
        handleSideClick={!loading.state ? alertModal.handleClose : () => {}}
        closeText={'ok'}
        loading={loading.state}
      >
        {!loading.state ? (
          <Typography
            p={2}
            sx={{
              color:
                alertModal.severity === 'warning'
                  ? 'warning.main'
                  : alertModal.severity === 'error'
                  ? 'error.main'
                  : 'secondary.main',
            }}
          >
            {alertModal.msg}
          </Typography>
        ) : (
          <Stack rowGap={2} p={2}>
            {loading.msg && (
              <Typography sx={{ color: 'primary.main' }} align='center'>
                {loading.msg}
              </Typography>
            )}
            <Box sx={{ height: '80px', width: '80px', margin: '10px auto' }}>
              <img src='/Images/loading.gif' alt='Loading...' width={'100%'} />
            </Box>
          </Stack>
        )}
      </CustomModal>
    </>
  )
}

export default ParticipationForm

import {
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, createContext } from 'react'
import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import reqs from '../../data/requests'
import { ClientContextConsumer } from './Client'
import ButtonInfo from '../components/Profile/ButtonInfo'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp'
import { CustomSnackBar, PermanentAlert } from '../../global_components/Alerts'
import ProfileImg from '../components/Profile/ProfileImg'

const ProfileContext = createContext()

const Profile = () => {
  const navigate = useNavigate()
  const { username } = useParams()
  const [snackBar, setSnackBar] = useState({
    open: false,
    msg: '',
    duration: 300,
    severity: '',
  })
  const [allProfileData, setAllProfileData] = useState({})
  const {
    clientProfile: { mode },
    clearClientProfile,
  } = ClientContextConsumer()
  const [logOutMode, setLogOutMode] = useState(false)

  const logOut = () => {
    axios.get(reqs.CLIENT_LOGOUT, { withCredentials: true }).then((res) => {
      if (res.data.succeed) {
        setLogOutMode(true)
        clearClientProfile()
        navigate(`/login`, { replace: true })
      }
    })
  }

  useEffect(() => {
    if (!logOutMode) {
      axios
        .get(`${reqs.FULL_SINGLE_DATA_CLIENT}${username}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.succeed) {
            let ParEvent = res.data.result.ParEvent
            let newParEvent = {
              eventInfo: JSON.parse(ParEvent.eventInfo),
              teamName: JSON.parse(ParEvent.teamName),
              paidEvent: JSON.parse(ParEvent.paidEvent),
              fee: JSON.parse(ParEvent.fee),
              transactionID: JSON.parse(ParEvent.transactionID),
              SubLinks: JSON.parse(ParEvent.SubLinks),
              SubNames: JSON.parse(ParEvent.SubNames),
              transactionNum: JSON.parse(ParEvent.transactionNum),
            }

            setAllProfileData({ ...res.data.result, ParEvent: newParEvent })
          } else {
            navigate(`/profile/view/${username}`, { replace: true })
          }
        })
        .catch(() => {
          navigate(`/profile/view/${username}`, { replace: true })
        })
    }
  }, [logOutMode])

  const { email, fullName } = allProfileData

  const setSnackBarMessage = (msg, duration, severity) => {
    setSnackBar({
      open: true,
      msg: msg || 'Link copied to clipboard',
      duration: duration || 2500,
      severity: severity || '',
    })
  }

  return (
    <ProfileContext.Provider
      value={{
        allProfileData,
        setAllProfileData,
        mode,
        setLogOutMode,
        setSnackBarMessage,
      }}
    >
      {/* for tutorial */}

      <Container sx={{ paddingTop: '80px' }} maxWidth='lg'>
        <Stack
          sx={{
            maxWidth: (theme) => theme.breakpoints.values.md,
            width: '100%',
            margin: '25px auto 100px auto',
          }}
        >
          <PermanentAlert cStyles={{ marginBottom: '25px' }} />
          <Paper
            square
            elevation={6}
            sx={{
              width: '100%',
              padding: '5px',
              display: 'grid',
            }}
          >
            <Stack alignItems={'flex-end'} width={'100%'}>
              <Button
                variant='soft'
                sx={{
                  width: 'max-content',
                  color: 'darkBlue.main',
                  fontSize: '.95rem',
                  transform: 'scale(.9)',
                }}
                startIcon={
                  <LogoutOutlinedIcon style={{ fontSize: '1.2rem' }} />
                }
                onClick={logOut}
              >
                logout
              </Button>
            </Stack>
            <Stack
              columnGap={3}
              rowGap={3}
              p={2}
              sx={{
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                pb: {
                  xs: 6,
                  sm: 5,
                },
                paddingLeft: { xs: '0', sm: '30px', md: '100px' },
                pr: { xs: 0, sm: 2 },
              }}
            >
              <ProfileImg
                allProfileData={allProfileData}
                mode={mode}
                setSnackBarMessage={setSnackBarMessage}
                setAllProfileData={setAllProfileData}
              />
              <Stack
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  rowGap: {
                    xs: 0.5,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: '2rem',
                      sm: '1.8rem',
                      md: '2rem',
                    },
                  }}
                >
                  {fullName}
                </Typography>
                <Typography pl={0.2} variant='body2' sx={{ opacity: 0.9 }}>
                  {username}
                  <IconButton
                    sx={{ padding: 0, pl: 0.7 }}
                    onClick={() => {
                      window.navigator.clipboard.writeText(username)
                      setSnackBarMessage('username copied to clipboard')
                    }}
                  >
                    <ContentCopySharpIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Typography>
                <Typography pl={0.2} variant='body2' sx={{ opacity: 0.8 }}>
                  {email}
                  <IconButton
                    sx={{ padding: 0, pl: 0.7 }}
                    onClick={() => {
                      window.navigator.clipboard.writeText(email)
                      setSnackBarMessage('email id copied to clipboard')
                    }}
                  >
                    <ContentCopySharpIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Typography>
              </Stack>
            </Stack>
            <ButtonInfo
              userName={username}
              allProfileData={allProfileData}
              setSnackBarMessage={setSnackBarMessage}
            />
          </Paper>
          <Outlet />
        </Stack>
        {/* custom snackbar */}
        <CustomSnackBar
          open={snackBar.open}
          message={snackBar.msg}
          duration={snackBar.duration}
          severity={snackBar.severity}
          onClose={() => {
            setSnackBar({ open: false, msg: '', duration: 3000 })
          }}
        />
      </Container>
    </ProfileContext.Provider>
  )
}

export const ProfileContextConsumer = () => {
  return useContext(ProfileContext)
}

export default Profile

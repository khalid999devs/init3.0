import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import reqs from '../data/requests'
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [adminLog, setAdminLog] = useState({
    userName: '',
    password: '',
  })

  const adminLogin = () => {
    axios
      .post(reqs.ADMIN_LOGIN, adminLog, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setError(false)
          navigate('/admin', { replace: true })
        }
      })
      .catch((err) => {
        setError(true)
        setErrorMsg(err.response?.data?.msg || 'Unable to sign in')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (adminLog.userName && adminLog.password) {
      adminLogin()
    } else {
      setError(true)
      setErrorMsg('Username or password must not be empty')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background:
          'radial-gradient(circle at 15% 20%, rgba(0, 188, 255, .20), transparent 30%), linear-gradient(135deg, #202437 0%, #111827 100%)',
      }}
    >
      <Paper
        elevation={16}
        sx={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 3,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '.9fr 1.1fr' },
        }}
      >
        <Stack
          justifyContent='space-between'
          sx={{
            p: { xs: 4, md: 6 },
            color: 'white',
            background:
              'linear-gradient(145deg, rgba(22, 168, 218, .95), rgba(21, 83, 126, .98))',
          }}
        >
          <Box>
            <Typography variant='overline' letterSpacing={2}>
              Notre Dame Information Technology Club
            </Typography>
            <Typography variant='h3' fontWeight={800} mt={2}>
              INIT 3.0
            </Typography>
            <Typography mt={1.5} sx={{ opacity: 0.86, lineHeight: 1.7 }}>
              A focused workspace for managing events, registrations, campus
              ambassadors, messages, and event media.
            </Typography>
          </Box>
          <Typography mt={5} variant='body2' sx={{ opacity: 0.72 }}>
            Authorized organizers only
          </Typography>
        </Stack>

        <Stack
          component='form'
          onSubmit={handleSubmit}
          spacing={2.25}
          sx={{ p: { xs: 4, sm: 6 }, justifyContent: 'center' }}
        >
          <Box>
            <Typography variant='h4' fontWeight={750} color='secondary.main'>
              Administrator sign in
            </Typography>
            <Typography mt={1} color='text.secondary'>
              Enter your organizer credentials to open the dashboard.
            </Typography>
          </Box>
          <Divider />
          {error && <Alert severity='error'>{errorMsg}</Alert>}
          <TextField
            error={error}
            label='Username'
            placeholder='Enter your username'
            variant='outlined'
            autoComplete='username'
            onChange={(e) =>
              setAdminLog((adminLog) => {
                return { ...adminLog, userName: e.target.value }
              })
            }
          />
          <TextField
            error={error}
            label='Password'
            type={'password'}
            placeholder='Enter your password'
            variant='outlined'
            autoComplete='current-password'
            onChange={(e) =>
              setAdminLog(() => {
                return { ...adminLog, password: e.target.value }
              })
            }
          />
          <Button
            variant='contained'
            type='submit'
            sx={{
              mt: 1,
              width: '100%',
              py: 1.25,
              fontWeight: 700,
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Login

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import reqs from '../data/requests'
import { Alert, Box, Button, Stack, TextField } from '@mui/material'

const QRLogin = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [qrLog, setQrLog] = useState({
    userName: '',
    password: '',
  })

  const adminLogin = () => {
    axios
      .post(reqs.QR_LOGIN, qrLog, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setError(false)
          navigate('/qrScanner', { replace: true })
        }
      })
      .catch((err) => {
        setError(true)
        setErrorMsg(err.response.data.msg)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (qrLog.userName && qrLog.password) {
      adminLogin()
    } else {
      setError(true)
      setErrorMsg('Username or password must not be empty')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '500px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            height: 'max-content',
            border: '2px solid rgb(169, 199, 214)',
          }}
        >
          <Alert severity={error ? 'error' : 'success'}>{errorMsg}</Alert>
          <TextField
            error={error}
            label='userName'
            placeholder='userName'
            variant='filled'
            onChange={(e) =>
              setQrLog((qrLog) => {
                return { ...qrLog, userName: e.target.value }
              })
            }
          />
          <TextField
            error={error}
            label='password'
            type={'password'}
            placeholder='password'
            variant='filled'
            onChange={(e) =>
              setQrLog((qrLog) => {
                return { ...qrLog, password: e.target.value }
              })
            }
          />
          <Button
            variant='contained'
            type='submit'
            sx={{
              mt: '40px',
              maxWidth: '200px',
              width: '100%',
              alignSelf: 'center',
            }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default QRLogin

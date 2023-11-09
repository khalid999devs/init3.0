import { useState, useEffect } from 'react'
import { AdminContextConsumer } from './Admin'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import styled from '@emotion/styled'
import { useForm } from '../../custom_hooks/useForm'
import SendIcon from '@mui/icons-material/Send'
import { HourglassTopOutlined } from '@mui/icons-material'
import axios from 'axios'
import reqs from '../../data/requests'
import { AlertModal } from '../../global_components/Alerts'

const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: '600px',
  width: '100%',
  padding: theme.spacing(2),
  border: '2px solid skyBlue',
  margin: '0 auto',
  marginBottom: theme.spacing(10),
}))

const StyledForm = styled('form')({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '20px',
})

const Messages = () => {
  const [searchParams] = useSearchParams()
  const { values, setValues, handleInputChange } = useForm({
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    name: searchParams.get('name') || '',
    emailtext: '',
    phoneText: '',
    emailSubject: '',
  })
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })

  const handleSendMessage = (e) => {
    e.preventDefault()
    setLoading(true)
    axios
      .post(
        `${reqs.SEND_SMS}custom`,
        { phone: values.phone, message: values.phoneText },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setValues((values) => {
            return { ...values, phone: '', phoneText: '' }
          })

          setAlertMsg({ msg: res.data.msg, severity: 'success' })
        } else {
          setAlertMsg({ msg: res.data.msg, severity: 'error' })
        }
        setLoading(false)
      })
      .catch((err) => {
        setAlertMsg({
          msg: err.response ? err.response.data.msg : 'something went wrong',
          severity: 'error',
        })
        setLoading(false)
      })
  }

  const handleSendEmail = (e) => {
    e.preventDefault()
    setLoading(true)
    const { email, emailSubject, emailtext } = values

    axios
      .post(
        `${reqs.EMAIL_MESSAGE}custom`,
        { text: emailtext, subject: emailSubject, email, name: '' },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setValues((values) => {
            return { ...values, email: '', emailSubject: '', emailtext: '' }
          })
          setLoading(false)
          setAlertMsg({ msg: 'Email sent successfully', severity: 'success' })
        }
      })
      .catch((err) => {
        setAlertMsg({
          msg: err.response ? err.response.data.msg : 'something went wrong',
          severity: 'error',
        })
        setLoading(false)
      })
  }
  return (
    <Container
      maxWidth='md'
      sx={{
        padding: {
          xs: '50px 10px 0 70px',
          xl: 0,
        },
        paddingTop: {
          xl: '50px',
        },
        minHeight: '100vh',
      }}
    >
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={1500}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}
      <StyledBox>
        <Typography align='center' variant='h5' color={'info.main'}>
          Send Email
        </Typography>

        <StyledForm onSubmit={handleSendEmail}>
          <TextField
            label={'Email'}
            placeholder='ex1@gmail.com , ex2@gmail.com'
            value={values.email}
            onChange={handleInputChange}
            name={'email'}
            required
          />
          <TextField
            label={'Subject'}
            placeholder='subject'
            value={values.emailSubject}
            onChange={handleInputChange}
            name={'emailSubject'}
            required
          />
          <TextField
            label={'text'}
            placeholder='text'
            value={values.emailtext}
            onChange={handleInputChange}
            name={'emailtext'}
            multiline
            required
          />
          <Stack width={'100%'} alignItems={'flex-end'} pr={3}>
            <Button
              variant='outlined'
              color='info'
              sx={{ width: '50px' }}
              type={'submit'}
              disabled={loading}
            >
              {loading ? (
                <HourglassTopOutlined />
              ) : (
                <SendIcon sx={{ transform: 'rotate(-45deg)' }} />
              )}
            </Button>
          </Stack>
        </StyledForm>
      </StyledBox>

      {/* message */}
      <StyledBox>
        <Typography align='center' variant='h5' color={'info.main'}>
          Send Message
        </Typography>

        <StyledForm onSubmit={handleSendMessage}>
          <TextField
            label={'phone'}
            placeholder='phone'
            value={values.phone}
            onChange={handleInputChange}
            name={'phone'}
            required
          />
          <TextField
            label={'message'}
            placeholder='message'
            value={values.phoneText}
            onChange={handleInputChange}
            name={'phoneText'}
            sx={{ minHeight: '50px' }}
            multiline
            required
          />
          <Stack width={'100%'} alignItems={'flex-end'} pr={3}>
            <Button
              variant='outlined'
              color='info'
              sx={{ width: '50px' }}
              type={'submit'}
              disabled={loading}
            >
              {loading ? (
                <HourglassTopOutlined />
              ) : (
                <SendIcon sx={{ transform: 'rotate(-45deg)' }} />
              )}
            </Button>
          </Stack>
        </StyledForm>
      </StyledBox>
    </Container>
  )
}

export default Messages

import styled from '@emotion/styled'
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import reqs from '../../../data/requests'
import ChangePass from './ChangePass'

const StyledFormControle = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    fontWeight: '500',
    opacity: 0.8,
  },
  marginRight: '30px',
})

const ResetPass = ({
  setModalOpen,
  clientLog,
  setClientLog,
  mode,
  setMode,
  modalOpen,
  clientProfile,
  rd,
  disabledInput,
}) => {
  const [msg, setMsg] = useState({ msg: '', severity: '' })
  const [rMode, setRMode] = useState('init') //init,changePass,sms,otp,done
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpClicked, setOtpClicked] = useState(false)
  const countDownRef = useRef()
  const [phone, setPhone] = useState('')
  const [otpMode, setOtpMOde] = useState('email')
  const otpLength = 4
  let id

  useEffect(() => {
    if (clientProfile.phone && rd === false && disabledInput === true) {
      setPhone(clientProfile.phone)
    }
  }, [clientProfile.phone])

  const handleResetPass = () => {
    setLoading(true)
    if (clientLog.email) {
      axios
        .post(reqs.RESET_PASSWORD_TOKEN, {
          email: clientLog.email.trim(),
          mode: mode,
          sendMode: otpMode === 'phone' ? 'sms' : 'email',
          number: phone.trim(),
        })
        .then((res) => {
          if (res.data.succeed) {
            setLoading(false)
            setRMode('otp')
            setMsg({ severity: 'success', msg: res.data.msg })
            setOtpClicked(true)
          }
        })
        .catch((err) => {
          setOtpClicked(true)
          setLoading(false)
          setMsg({
            msg: err.response && err.response.data.msg,
            severity: 'error',
          })
        })
    } else if (otpMode === 'sms' && phone) {
      setLoading(false)
    } else {
      setLoading(false)
      setMsg({
        msg: `${otpMode} field should not be empty`,
        severity: 'error',
      })
    }
  }

  const handleOtpVerify = () => {
    axios
      .post(
        reqs.OTP_VERIFY_RESET_PASSWORD,
        {
          email: otpMode === 'email' ? clientLog.email : '',
          mode: 'ov',
          phone: otpMode === 'phone' ? phone : '',
          otp: otp,
          clientMode: mode,
          sendMode: otpMode === 'phone' ? 'sms' : 'email',
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed && res.data.type === 'ov') {
          clearInterval(id)
          otpClicked && setOtpClicked(false)

          setRMode('changePass')
          setMsg({ msg: '', severity: '' })
        } else {
          setMsg({ msg: res.data.msg, severity: 'error' })
        }
      })
      .catch((err) => {
        setMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  useEffect(() => {
    if (otp.length === otpLength) {
      handleOtpVerify()
    }
  }, [otp])

  useEffect(() => {
    if (otpClicked) {
      const finalTime = Date.now() + 30 * 1000
      let differT
      id = setInterval(() => {
        differT = Math.round((finalTime - Date.now()) / 1000)
        if (countDownRef) countDownRef.current.textContent = differT || ''
        if (differT < 1 || rMode === 'changePass') {
          clearInterval(id)
          setOtpClicked(false)
        }
      }, [1000])
    }
    return () => clearInterval(id)
  }, [otpClicked])

  return (
    <Stack p={2}>
      {loading ? (
        <Box
          sx={{
            alignSelf: 'center',
            height: '100px',
            width: '100px',
            display: 'grid',
            placeItems: 'center',
            userSelect: 'none',
          }}
        >
          <img src='/Images/loading.gif' alt='loading...' />
        </Box>
      ) : (
        <Stack
          rowGap={2}
          sx={{ maxWidth: '80%', width: '100%', margin: '0 auto' }}
        >
          {(rMode === 'init' || rMode === 'sms') && (
            <>
              {rMode === 'sms' ? (
                <TextField
                  label={
                    rd === true
                      ? 'please enter your mobile number you used to register'
                      : 'Your mobile number'
                  }
                  size='medium'
                  placeholder='01XXXXXXXXX'
                  type={'text'}
                  focused
                  variant='standard'
                  disabled={disabledInput}
                  sx={{
                    '& .Mui-disabled,& input:disabled': {
                      color: 'rgba(0,0,0,.8)',
                    },
                  }}
                  color='secondary'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={
                    phone.length < 11 ||
                    phone.length > 11 ||
                    /[a-zA-Z]/.test(phone) === true
                  }
                  helperText={
                    phone.length < 11 || phone.length > 11
                      ? 'mobile number must be of 11 digits'
                      : /[a-zA-Z]/.test(phone)
                      ? 'number should not contain any letter'
                      : null
                  }
                />
              ) : (
                <TextField
                  label='your email'
                  size='medium'
                  placeholder='email'
                  disabled={disabledInput}
                  type={'email'}
                  sx={{
                    '& .Mui-disabled,& input:disabled': {
                      color: 'rgba(0,0,0,.8)',
                    },
                  }}
                  focused
                  variant='standard'
                  color='secondary'
                  value={clientLog.email}
                  onChange={(e) =>
                    setClientLog((clientLog) => {
                      return { ...clientLog, email: e.target.value }
                    })
                  }
                />
              )}

              <FormControl
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', xsm: 'row' },
                  alignItems: 'center',
                  columnGap: 3,
                }}
              >
                <FormLabel
                  id='demo-radio-buttons-group-label'
                  sx={{ fontWeight: 500, ml: 0.5, display: 'inline' }}
                >
                  Reset as :
                </FormLabel>
                <RadioGroup
                  aria-labelledby='mode-change-radio'
                  defaultValue={'par'}
                  name='mode-change-radio'
                  row
                  value={mode}
                >
                  <StyledFormControle
                    value='par'
                    control={<Radio />}
                    label='participant'
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <StyledFormControle
                    value='ca'
                    control={<Radio />}
                    label='CA'
                    onChange={(e) => setMode(e.target.value)}
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {rMode === 'changePass' && (
            <>
              <ChangePass
                mode={mode}
                email={clientLog.email}
                phone={phone}
                otp={otp}
                setMsg={setMsg}
                setRMode={setRMode}
                otpMode={otpMode}
              />
            </>
          )}

          {rMode === 'otp' && (
            <>
              <TextField
                label='please enter the 4 digit otp sent to you'
                size='medium'
                placeholder='XXXX'
                type={'number'}
                focused
                variant='filled'
                color='secondary'
                value={otp}
                onChange={(e) => setOtp(e.target.value.toString())}
                error={otp.length < otpLength || otp.length > otpLength}
              />
            </>
          )}
        </Stack>
      )}

      {msg.msg && (
        <Alert
          sx={{ alignSelf: 'center', fontSize: '.8rem' }}
          severity={msg.severity === 'error' ? 'error' : 'success'}
          icon={false}
        >
          {msg.msg}
        </Alert>
      )}

      {rMode !== 'changePass' && rMode !== 'done' && (
        <>
          {otpClicked === false ? (
            <Button
              variant='outlined'
              color={'darkBlue'}
              sx={{
                width: 'max-content',
                borderRadius: 0,
                alignSelf: 'center',
                mt: 5,
              }}
              onClick={handleResetPass}
            >
              GET OTP
            </Button>
          ) : (
            <Typography
              align='center'
              color={'darkBlue.main'}
              component={'p'}
              fontSize={'.9rem'}
              mt={4}
            >
              you will be able to ask for new otp within{' '}
              <Typography
                ref={countDownRef}
                component={'span'}
                color={'warning.main'}
              ></Typography>{' '}
              seconds
            </Typography>
          )}
          {otpClicked === false && (
            <>
              <Button
                sx={{
                  width: 'max-content',
                  borderRadius: 0,
                  alignSelf: 'center',
                  mt: 2,
                  textTransform: 'lowercase',
                }}
                color={'info'}
                onClick={() => {
                  if (otpMode === 'email') {
                    setOtpMOde('phone')
                    setRMode('sms')
                  } else {
                    setOtpMOde('email')
                    setRMode('init')
                  }
                }}
              >
                {otpMode === 'email'
                  ? 'send with sms instead ?'
                  : 'send with email instead'}
              </Button>
            </>
          )}
        </>
      )}
    </Stack>
  )
}

export default ResetPass

import styled from '@emotion/styled'
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RouterStyledLink } from '../../customStyles/StyledLinks'
import reqs from '../../data/requests'
import { ClientContextConsumer } from './Client'
import { CustomModal } from '../../global_components/Modals'
import ResetPass from '../components/Login/ResetPass'
import { useEffect } from 'react'

const StyledFormControle = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    fontWeight: '500',
    opacity: 0.8,
  },
  marginRight: '30px',
})

const CLogin = () => {
  const [searchParams] = useSearchParams()
  const [rd, setRd] = useState(searchParams.get('rd') == 0 ? false : true)
  const [disabledInput, setDisabledInput] = useState(
    searchParams.get('di') == 1 ? true : false
  )
  const { triggerAv, setTriggerAv, clientProfile } = ClientContextConsumer()
  const [isPassModal, setIsPassModal] = useState(
    searchParams.get('pm') == 1 ? true : false
  )
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [clientLog, setClientLog] = useState({
    email: '',
    password: '',
  })
  const [mode, setMode] = useState('par')

  const ClientLogin = () => {
    axios
      .post(
        reqs[mode === 'par' ? 'PAR_LOGIN' : 'CA_LOGIN'],
        { email: clientLog.email.trim(), password: clientLog.password, mode },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.succeed) {
          setError(false)
          setErrorMsg('')
          setClientLog({
            email: '',
            password: '',
          })
          setRd(true)
          setErrorMsg(res.data.msg)
          setTriggerAv(!triggerAv)
        } else {
          setError(true)
          setErrorMsg(res.data.msg)
        }
      })
      .catch((err) => {
        setError(true)
        setErrorMsg(err.response.data.msg)
      })
  }

  useEffect(() => {
    if (clientProfile.userName && rd === true) {
      navigate(`/profile/${clientProfile.userName}`)
    } else if (clientProfile.email && rd === false && disabledInput === true) {
      setClientLog((clientLog) => {
        return { ...clientLog, email: clientProfile.email }
      })
      setMode(clientProfile.mode)
    }
  }, [clientProfile])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (clientLog.email && clientLog.password) {
      ClientLogin()
    } else {
      setError(true)
      setErrorMsg('email or password must not be empty')
    }
  }

  return (
    <Container maxWidth={'md'} sx={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Typography
        fontSize={'3rem'}
        fontWeight={'500'}
        color={'darkBlue.main'}
        textTransform={'uppercase'}
        align='center'
      >
        Login
      </Typography>
      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        marginTop={'70px'}
        flexDirection={'column'}
      >
        <Typography mb={1}>
          Do not have any account?
          <RouterStyledLink
            style={{ marginLeft: '5px' }}
            to='/registration/participant'
          >
            Sign Up now !!
          </RouterStyledLink>
        </Typography>
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
              padding: '35px 40px 35px 40px',
              maxWidth: '400px',
              width: '100%',
              minHeight: '300px',
              height: 'max-content',
              boxShadow: '0 0 10px 2px rgba(0,0,0,.2)',
              margin: '0 auto',
            }}
          >
            {errorMsg && (
              <Alert severity={error ? 'error' : 'success'}>{errorMsg}</Alert>
            )}
            <Stack justifyContent={'center'} rowGap={3}>
              <TextField
                error={error}
                label='Email'
                placeholder='email'
                type={'email'}
                variant='standard'
                sx={{
                  '& .Mui-disabled,& input:disabled': {
                    color: 'rgba(0,0,0,.9)!important',
                  },
                }}
                value={clientLog.email}
                disabled={disabledInput}
                onChange={(e) =>
                  setClientLog((clientLog) => {
                    return { ...clientLog, email: e.target.value }
                  })
                }
                size='medium'
              />
              <TextField
                error={error}
                label='Password'
                value={clientLog.password}
                type={'password'}
                placeholder='password'
                variant='standard'
                onChange={(e) =>
                  setClientLog((clientLog) => {
                    return { ...clientLog, password: e.target.value }
                  })
                }
              />

              <FormControl>
                <FormLabel
                  id='demo-radio-buttons-group-label'
                  sx={{ fontWeight: 500, ml: 0.5 }}
                >
                  Login as :
                </FormLabel>
                <RadioGroup
                  aria-labelledby='mode-change-radio'
                  defaultValue={'par'}
                  name='mode-change-radio'
                  row
                  sx={{ margin: '0 auto' }}
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
            </Stack>

            <Stack pt={1}>
              <Button
                variant='outlined'
                type='submit'
                sx={{
                  maxWidth: 'max-content',
                  alignSelf: 'center',
                  padding: '5px 30px',
                  fontSize: '.95rem',
                  letterSpacing: '1px',
                  borderRadius: 0,
                }}
                color={'darkBlue'}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
      <Typography
        align='center'
        mt={1.5}
        sx={{
          fontWeight: 500,
          letterSpacing: '.7px',
          cursor: 'pointer',
          transition: '.3s ease all',
          '&:hover': {
            color: 'warning.light',
          },
        }}
        color={'warning.dark'}
        onClick={() => {
          setIsPassModal(true)
        }}
      >
        Forgot password ?
      </Typography>
      {/* reset pass modal */}
      <CustomModal open={isPassModal} setOpen={setIsPassModal}>
        <ResetPass
          setModalOpen={setIsPassModal}
          clientLog={clientLog}
          setClientLog={setClientLog}
          mode={mode}
          setMode={setMode}
          modalOpen={isPassModal}
          clientProfile={clientProfile}
          rd={rd}
          disabledInput={disabledInput}
        />
      </CustomModal>
    </Container>
  )
}

export default CLogin

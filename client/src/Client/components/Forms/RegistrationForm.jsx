import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import SendIcon from '@mui/icons-material/Send'
import { useForm } from '../../../custom_hooks/useForm'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import {
  CustomInField,
  CustomSelectField,
} from '../../../global_components/CustomFormControls'
import { classesOption } from '../../../data/client'
import UploadInput from './UploadInput'
import { useState } from 'react'
import { mediumValidPass, passRegEx } from '../../../Utils/validations'
import CheckBox from './CheckBox'
import { CustomModal } from '../../../global_components/Modals'
import axios from 'axios'
import { objToFormData } from '../../../Utils/formFunctions'
import reqs from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'
import { GlobalContextConsumer } from '../../../GlobalContext'

const StyledFormControle = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontWeight: '500',
    opacity: 0.8,
    color: theme.palette.semiWhite.main,
    fontSize: '1rem',
    fontFamily: `'Titillium Web', sans-serif`,
    letterSpacing: '.8px',
  },
  '& .MuiRadio-root ,& .Mui-checked': {
    color: theme.palette.semiWhite.light,
  },
  '& .MuiRadio-root.Mui-checked': {
    color: theme.palette.semiWhite.light,
  },
  marginRight: '30px',
}))

const RegistrationForm = ({ mode, redirectEvent }) => {
  const {
    appSetting: { caRegPermit },
  } = GlobalContextConsumer()
  const { triggerAv, setTriggerAv } = ClientContextConsumer()
  const navigate = useNavigate()
  const [alert, setAlert] = useState({ msg: '', severity: '' })

  const { values, setValues, handleInputChange } = useForm({
    institute: '',
    className: '',
    address: '',
    email: '',
    fb: '',
    phone: '',
    CAref: '',
    password: '',
    cPassword: '',
    file: {},
    fullName: '',
  })

  const [errors, setErrors] = useState({
    institute: '',
    className: '',
    address: '',
    email: '',
    fb: '',
    phone: '',
    CAref: 'if you have any (not mandatory)',
    password: '',
    cPassword: '',
    fullName: '',
  })

  const [cookieChecked, setCookieChecked] = useState(false)
  const [keepLogged, setKeepLogged] = useState(true)
  const [subMitModal, setSubMitModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [navigateProfile, setNavigateProfile] = useState({
    username: '',
    state: false,
  })

  const emptyValues = () => {
    setValues({
      institute: '',
      className: '',
      address: '',
      email: '',
      fb: '',
      phone: '',
      CAref: '',
      password: '',
      cPassword: '',
      file: {},
      fullName: '',
    })
  }

  const fConditions = () => {
    setSubMitModal(true)
    setAlert({ msg: 'Please fulfill the conditions', severity: 'warning' })
  }

  const handleReg = (e) => {
    e.preventDefault()
    let submit = true

    if (!values.file.type) {
      submit = false
      setAlert({ msg: 'You must provide a profile photo', severity: 'error' })
      setSubMitModal(true)
    }

    if (values.fullName.length > 50) {
      submit = false
      fConditions()
    }
    if (!values.className) {
      submit = false
      setErrors((errors) => {
        return { ...errors, className: 'field should not be empty' }
      })
      fConditions()
    }

    for (let key in errors) {
      if (errors[key] !== '' && key !== 'CAref') {
        submit = false
        fConditions()
      }
    }

    if (submit == true) {
      setSubMitModal(true)
      setLoading(true)
      let fd = objToFormData(values)
      fd.delete('file')
      if (mode === 'participant') {
        fd.append('participants', values.file)
      } else if (mode === 'ca') {
        fd.delete('CAref')
        fd.append('CA', values.file)
      }
      axios
        .post(`${mode === 'participant' ? reqs.PAR_REG : reqs.CA_REG}`, fd)
        .then((res) => {
          if (res.data.succeed) {
            setAlert({
              msg: `${res.data.msg}${
                redirectEvent.event
                  ? ` After clicking "Ok" you will be redirected to the participation form. Please do not forget to fill it up or you will not be counted as a participant in "${redirectEvent.event}"`
                  : ''
              }`,
              severity: 'success',
            })
            emptyValues()
            localStorage.setItem('first', JSON.stringify({ state: true }))

            if (keepLogged === true) {
              return axios
                .post(
                  reqs[mode === 'participant' ? 'PAR_LOGIN' : 'CA_LOGIN'],
                  {
                    email: values.email,
                    password: values.password,
                    mode: mode === 'participant' ? 'par' : 'ca',
                  },
                  {
                    withCredentials: true,
                  }
                )
                .then((res) => {
                  if (res.data.succeed) {
                    setLoading(false)
                    setTriggerAv(!triggerAv)
                    setNavigateProfile({
                      username: res.data.username,
                      state: true,
                    })
                  } else {
                    setAlert({ msg: res.data.msg, severity: 'error' })
                    setLoading(false)
                  }
                })
            } else {
              setLoading(false)
            }
          } else {
            setAlert({ msg: res.data.msg, severity: 'error' })
            setLoading(false)
          }
        })
        .catch((err) => {
          setAlert({ msg: err.response.data.msg, severity: 'error' })
          setLoading(false)
        })
    }
  }

  const handleModalCloseAndSideClick = () => {
    setSubMitModal(false)
    if (navigateProfile.state === true && redirectEvent.event) {
      navigate(`/participation/${redirectEvent.team}/${redirectEvent.event}`)
    } else if (navigateProfile.state === true) {
      navigate(`/profile/${navigateProfile.username}`)
    }
  }

  return (
    <>
      <form
        style={{
          display: 'grid',
          rowGap: '40px',
        }}
        onSubmit={handleReg}
      >
        <Stack>
          {/* mode radio group */}
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', xsm: 'row' },
              alignItems: { xs: 'flex-start', xsm: 'center' },
              columnGap: 2,
            }}
          >
            <FormLabel
              id='demo-radio-buttons-group-label'
              sx={{
                fontWeight: 400,
                fontFamily: `'Titillium Web', sans-serif`,
                letterSpacing: '.8px',
                ml: 0.5,
                display: 'inline',
                color: 'info.light',
                '&.Mui-focused': {
                  color: 'info.light',
                },
              }}
            >
              Sign Up as :
            </FormLabel>
            <RadioGroup
              aria-labelledby='mode-change-radio'
              defaultValue={'par'}
              name='mode-change-radio'
              row
              value={mode}
              sx={{ margin: { xs: '0 auto', xsm: 0 } }}
            >
              <StyledFormControle
                value='participant'
                control={<Radio sx={{ color: 'semiWhite.light' }} />}
                label='participant'
                onChange={(e) => {
                  mode !== 'participant' &&
                    navigate(`/registration/${e.target.value}`, {
                      replace: true,
                    })
                }}
              />
              {caRegPermit === true && (
                <StyledFormControle
                  value='ca'
                  control={<Radio sx={{ color: 'semiWhite.light' }} />}
                  label='CA'
                  onChange={(e) => {
                    mode !== 'ca' &&
                      navigate(`/registration/${e.target.value}`, {
                        replace: true,
                      })
                  }}
                />
              )}
            </RadioGroup>
          </FormControl>

          {/* upper part with profile img */}
          <Box
            pl={0.5}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              pt: 2,
              columnGap: '60px',
              rowGap: '60px',
            }}
          >
            <Stack rowGap={3}>
              <CustomInField
                label={'Full name'}
                value={values.fullName}
                name={'fullName'}
                onChange={(e) => {
                  handleInputChange(e)
                  const value = e.target.value
                  if (value.length > 40) {
                    setErrors((errors) => {
                      return { ...errors, fullName: 'name is too long' }
                    })
                  } else {
                    errors.fullName &&
                      setErrors((errors) => {
                        console.log('fsd')
                        return { ...errors, fullName: '' }
                      })
                  }
                }}
                msg={errors.fullName}
              />

              <CustomInField
                label={'Address'}
                value={values.address}
                name={'address'}
                onChange={handleInputChange}
                msg={errors.address}
              />
            </Stack>

            {/* photo */}
            <Stack
              sx={{
                width: 'fit-content',
                justifySelf: 'center',
                padding: '0 20px',
                marginTop: -2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '100px',
                  width: '100px',
                  margin: '0 auto',
                  minHeight: '110px',
                  boxShadow:
                    !values.file.type && '2px 2px 5px 0px rgba(0,0,0,.3)',
                  position: 'relative',
                  ...(!values.file.type && {
                    display: 'grid',
                    placeItems: 'center',
                  }),
                }}
              >
                {values.file.type && <ImgViewer file={values.file} />}
                {!values.file.type && (
                  <UploadInput
                    name={
                      <>
                        upload
                        <br />
                        photo
                      </>
                    }
                    values={values}
                    setValues={setValues}
                    cStyles={{
                      margin: 'auto',
                    }}
                  />
                )}
              </Box>

              {values.file.type && (
                <UploadInput
                  name={'change'}
                  values={values}
                  setValues={setValues}
                />
              )}
            </Stack>
          </Box>

          {/* lower part */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 4,
            }}
            pl={0.5}
            pt={4}
          >
            <CustomInField
              label={'Email ID'}
              value={values.email}
              name={'email'}
              type={'email'}
              onChange={handleInputChange}
              msg={errors.email}
              placeholder={'example@gmail.com'}
            />
            <CustomInField
              label={'Mobile number'}
              value={values.phone}
              name={'phone'}
              onChange={(e) => {
                handleInputChange(e)
                const value = e.target.value
                if (value.length < 11 || value.length > 11)
                  setErrors((errors) => {
                    return { ...errors, phone: 'must be of 11 digits' }
                  })
                else if (/[a-zA-Z]/.test(value)) {
                  setErrors((errors) => {
                    return { ...errors, phone: 'must not contain any letter' }
                  })
                } else {
                  errors.phone &&
                    setErrors((errors) => {
                      return { ...errors, phone: '' }
                    })
                }
              }}
              msg={errors.phone}
              placeholder={'01XXXXXXXXX'}
            />
            <CustomInField
              label={'Institute'}
              value={values.institute}
              name={'institute'}
              onChange={handleInputChange}
              msg={errors.institute}
            />
            <CustomSelectField
              label={'Class'}
              onChange={(e) => {
                if (e.target.value == '') {
                  setErrors((errors) => {
                    return { ...errors, className: 'must select a class' }
                  })
                } else {
                  errors.className &&
                    setErrors((errors) => {
                      return { ...errors, className: '' }
                    })
                }
                setValues((values) => {
                  return { ...values, className: e.target.value }
                })
              }}
              options={classesOption}
              msg={errors.className}
            />
            <CustomInField
              label={'Fb link'}
              value={values.fb}
              type={'url'}
              name={'fb'}
              onChange={handleInputChange}
              msg={errors.fb}
            />

            {mode !== 'ca' && (
              <CustomInField
                label={'CA reference'}
                value={values.CAref}
                name={'CAref'}
                onChange={handleInputChange}
                msg={errors.CAref}
                errType={'none'}
                required={false}
                placeholder={'CA code'}
              />
            )}
            {/* passwords */}
            <CustomInField
              label={'password'}
              value={values.password}
              name={'password'}
              type={'password'}
              onChange={(e) => {
                handleInputChange(e)
                const value = e.target.value
                if (
                  !passRegEx.test(value) &&
                  !mediumValidPass.test(value) &&
                  value.length > 0
                )
                  setErrors((errors) => {
                    return { ...errors, password: 'weak password' }
                  })
                else {
                  setErrors((errors) => {
                    return { ...errors, password: '' }
                  })
                }
              }}
              showIcon={true}
              msg={errors.password}
            />
            <CustomInField
              label={'confirm Password'}
              value={values.cPassword}
              name={'cPassword'}
              type={'password'}
              onChange={(e) => {
                handleInputChange(e)
                const value = e.target.value
                if (!values.password) {
                  setErrors((errors) => {
                    return {
                      ...errors,
                      password: 'please provide the password',
                    }
                  })
                } else if (value !== values.password && value.length > 0)
                  setErrors((errors) => {
                    return { ...errors, cPassword: 'password did not match' }
                  })
                else {
                  setErrors((errors) => {
                    return { ...errors, cPassword: '' }
                  })
                }
              }}
              showIcon={true}
              msg={errors.cPassword}
            />
          </Box>
        </Stack>

        <Stack width={'fit-content'} sx={{ margin: '0 auto' }}>
          <CheckBox
            checked={cookieChecked}
            onChange={() => setCookieChecked(!cookieChecked)}
          />
          <CheckBox
            text={'Keep me logged in'}
            checked={keepLogged}
            onChange={() => setKeepLogged(!keepLogged)}
          />
        </Stack>

        {/* submit button */}
        <Stack alignItems={'flex-end'} p={2} pt={0}>
          <Button
            type='submit'
            variant='outlined'
            color='info'
            endIcon={<SendIcon />}
            sx={{
              width: 'max-content',
              borderRadius: 0,
              '&:disabled': {
                color: 'info.main',
                borderColor: 'info.main',
                opacity: '.5',
              },
            }}
            disabled={!cookieChecked}
          >
            submit
          </Button>
        </Stack>
      </form>
      {/* form ends */}

      {/* custom modal */}
      <CustomModal
        open={subMitModal}
        handleClose={handleModalCloseAndSideClick}
        handleSideClick={handleModalCloseAndSideClick}
        setOpen={setSubMitModal}
        closeText={'ok'}
      >
        {loading ? (
          <Stack
            p={4}
            alignItems={'center'}
            width={'100%'}
            justifyContent={'center'}
          >
            <Box sx={{ width: '80px', height: '80px' }}>
              <img src='/Images/loading.gif' width={'100%'} alt='Loading...' />
            </Box>
          </Stack>
        ) : (
          <Stack p={2}>
            <Typography
              sx={{
                color:
                  alert.severity === 'error'
                    ? 'error.main'
                    : alert.severity === 'warning'
                    ? 'warning.main'
                    : alert.severity === 'success'
                    ? 'success.main'
                    : 'secondary.main',
                fontWeight: 400,
                fontSize: '1rem',
              }}
            >
              {alert.msg}
            </Typography>
          </Stack>
        )}
      </CustomModal>
    </>
  )
}

const ImgViewer = React.memo(({ file }) => {
  return (
    <img
      width={'100%'}
      style={{
        objectFit: 'cover',
        height: 'auto',
      }}
      src={window.URL.createObjectURL(file)}
      alt='person '
    />
  )
})

export default RegistrationForm

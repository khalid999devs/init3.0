import { Button, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import reqs from '../../../data/requests'
import { InconedTextField } from '../../../global_components/Structures'
import { mediumValidPass, passRegEx } from '../../../Utils/validations'

const ChangePass = ({ mode, email, phone, otp, setMsg, setRMode, otpMode }) => {
  const [newPass, setNewPass] = useState({
    original: '',
    verify: '',
    seeO: false,
    seeV: false,
    errO: false,
    errV: false,
    helperV: '',
    helperO: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!mediumValidPass.test(newPass.original)) {
      setMsg({
        msg: 'password must contain at least 6 characters including letters and numbers ',
        severity: 'error',
      })
    } else if (
      newPass.original &&
      newPass.verify &&
      newPass.original === newPass.verify
    ) {
      axios
        .post(
          reqs.OTP_VERIFY_RESET_PASSWORD,
          {
            password: newPass.original,
            email: otpMode === 'email' ? email : '',
            mode: '',
            phone: otpMode === 'phone' ? phone : '',
            otp: otp,
            clientMode: mode,
            sendMode: otpMode === 'phone' ? 'sms' : 'email',
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.succeed) {
            setNewPass({
              original: '',
              verify: '',
              seeO: false,
              seeV: false,
              errO: false,
              errV: false,
              helperV: '',
              helperO: '',
            })
            setMsg({
              msg: res.data.msg,
              severity: 'success',
            })
            setRMode('done')
          } else {
            setMsg({
              msg: res.data.msg,
              severity: 'error',
            })
          }
        })
        .catch((err) => {
          setMsg({
            msg: err.response.data.msg,
            severity: 'error',
          })
        })
    } else {
      setMsg({
        msg: 'password fields should not be empty or please fulfill the conditions',
        severity: 'error',
      })
    }
  }
  return (
    <form
      style={{
        width: '90%',
        margin: '0 auto',
        display: 'grid',
        rowGap: '20px',
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant='subtitle2' color={'warning.main'}>
        resetting the password as a{' '}
        <Typography
          fontWeight={'500'}
          component={'span'}
          color={'darkBlue.main'}
        >
          {mode === 'par' ? ' participant' : ' CA'}
        </Typography>
      </Typography>
      <InconedTextField
        required={true}
        value={newPass.original}
        helpertext={
          newPass.helperO
            ? newPass.helperO
            : newPass.original.length > 0 &&
              (passRegEx.test(newPass.original)
                ? 'strength level : strong'
                : mediumValidPass.test(newPass.original)
                ? 'strength level : medium'
                : 'weak password')
        }
        error={newPass.errO}
        onChange={(e) =>
          setNewPass((newPass) => {
            return { ...newPass, original: e.target.value }
          })
        }
        label={'new password'}
        showPass={newPass.seeO}
        handleClickButton={() =>
          setNewPass((newPass) => {
            return { ...newPass, seeO: !newPass.seeO }
          })
        }
        customStyle={{}}
      />
      <InconedTextField
        required={true}
        value={newPass.verify}
        helpertext={
          newPass.helperV
            ? newPass.helperV
            : newPass.verify.length > 0 &&
              newPass.original.length > 0 &&
              newPass.original !== newPass.verify &&
              'password did not match'
        }
        error={
          newPass.errV
            ? newPass.errV
            : newPass.verify.length > 0 &&
              newPass.original.length > 0 &&
              newPass.original !== newPass.verify
        }
        onChange={(e) => {
          setNewPass((newPass) => {
            return { ...newPass, verify: e.target.value }
          })
        }}
        label={'confirm password'}
        showPass={newPass.seeV}
        handleClickButton={() =>
          setNewPass((newPass) => {
            return { ...newPass, seeV: !newPass.seeV }
          })
        }
        customStyle={{}}
      />

      <Stack width={'100%'} mt={3}>
        <Button
          variant='contained'
          color='darkBlue'
          type='submit'
          sx={{
            width: 'max-content',
            alignSelf: 'center',
            borderRadius: 0,
            color: 'body.main',
          }}
        >
          Reset Password
        </Button>
      </Stack>
    </form>
  )
}

export default ChangePass

import React, { useEffect, useState } from 'react'
import { objToArray } from '../../../Utils/objToArray'
import { ProfileContextConsumer } from '../../pages/Profile'
import { infoTitles } from '../../../data/client'
import { useForm } from '../../../custom_hooks/useForm'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import PasswordMOdal from './PasswordMOdal'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import reqs from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'

const AboutInfo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { triggerAv, setTriggerAv } = ClientContextConsumer()
  const { allProfileData, setAllProfileData } = ProfileContextConsumer()
  const {
    address,
    className,
    email,
    fb,
    fullName,
    institute,
    phone,
    userName,
  } = allProfileData
  let infoArr = objToArray(
    fullName
      ? {
          fullName,
          email,
          fb,
          phone,
          institute,
          className,
          address,
        }
      : {}
  )

  const [editMode, setEditMode] = useState(
    searchParams.get('edit') == 1 ? true : false
  )
  useEffect(() => {
    setEditMode(searchParams.get('edit') == 1 ? true : false)
  }, [searchParams])

  const [passModalMode, setPassModalMode] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setErros] = useState({
    type: false,
    msg: '',
  })
  const [loading, setLoading] = useState(false)
  const { values, setValues, handleInputChange } = useForm({
    fullName,
    email,
    phone,
    institute,
    className,
  })
  useEffect(() => {
    if (fullName || editMode === false)
      setValues({
        fullName: fullName || '',
        email: email || '',
        phone: phone || '',
        institute: institute || '',
        className: className || '',
      })
  }, [fullName, editMode])

  const clearUp = () => {
    setErros({ type: false, msg: '' })
    setPassword('')
    setPassModalMode(false)
    navigate(`/profile/${userName}/about`, { replace: true })
  }

  const handleInfoEdit = () => {
    setLoading(true)
    axios
      .patch(
        reqs.PROFILE_EDIT,
        { ...values, password },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false)
        if (res.data.succeed) {
          setAllProfileData((allProfileData) => {
            return { ...allProfileData, ...values }
          })
          setTriggerAv(!triggerAv)
          clearUp()
        } else {
          setErros({ type: true, msg: res.data.msg })
        }
      })
      .catch((err) => {
        setErros({ type: true, msg: err.response.data.msg })
        setLoading(false)
      })
  }

  return (
    <>
      <Box width={'100%'} height={'100%'} sx={{ display: 'grid' }}>
        <Box
          sx={{
            padding: '5px 30px',
            gap: '25px',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          {infoArr.map((item, key) => {
            return (
              <TextField
                key={key}
                variant='standard'
                label={infoTitles[item.name]}
                name={item.name}
                id={item.name}
                value={
                  values[item.name] || values[item.name] === ''
                    ? values[item.name]
                    : item.value
                }
                onChange={(e) => {
                  if (values[item.name] || values[item.name] === '') {
                    handleInputChange(e)
                  }
                }}
                sx={{
                  '& label': {
                    fontWeight: '500',
                    color: 'darkBlue.main',
                  },
                  '& .Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0,0,0,.6)',
                    color: 'rgba(0,0,0,.6)',
                  },
                  '& .MuiInput-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0,0,0,.6)',
                    color: 'rgba(0,0,0,.6)',
                  },
                }}
                disabled={
                  (values[item.name] || values[item.name] === '') && editMode
                    ? false
                    : true
                }
                helperText={
                  values[item.name] === '' ? 'field should not be empty' : ''
                }
                error={values[item.name] === '' ? true : false}
              />
            )
          })}
        </Box>
        {editMode && (
          <Stack
            alignItems={'flex-end'}
            justifyContent={'flex-end'}
            flexDirection={'row'}
            width={'100%'}
            flexWrap={'wrap'}
            sx={{ paddingTop: '10px' }}
          >
            <Button
              color='success'
              endIcon={<DoneIcon />}
              onClick={(_) => setPassModalMode(true)}
            >
              done
            </Button>
            <Button
              color='error'
              endIcon={<CloseIcon />}
              onClick={(_) => {
                clearUp()
              }}
            >
              cancel
            </Button>
          </Stack>
        )}
      </Box>

      {/* password transaction edit */}
      <PasswordMOdal
        open={passModalMode}
        handleClose={() => {
          clearUp()
        }}
        handleSubmit={handleInfoEdit}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        value={password}
        error={error.type}
        helpertext={error.msg}
        loading={loading}
      >
        <Typography pl={2} fontSize={'.9rem'}>
          Are you sure you want to make the changes ?
        </Typography>
      </PasswordMOdal>
    </>
  )
}

export default AboutInfo

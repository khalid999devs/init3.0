import {
  Stack,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material'

import React, { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { objToArray } from '../../../Utils/objToArray'
import { ProfileContextConsumer } from '../../pages/Profile'
import PasswordMOdal from './PasswordMOdal'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import reqs from '../../../data/requests'
import EditIcon from '@mui/icons-material/Edit'
import { CustomSnackBar } from '../../../global_components/Alerts'
import { ChangeTypo } from '../../../global_components/Typographies'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import VerifiedUserSharpIcon from '@mui/icons-material/VerifiedUserSharp'
import IconInfo from './IconInfo'

const TransactionId = () => {
  const { allProfileData, mode, setAllProfileData } = ProfileContextConsumer()
  const { ParEvent, fullName, email } = allProfileData

  const [transactionArr, setTrnasactionArr] = useState([])
  useEffect(() => {
    ParEvent &&
      setTrnasactionArr(objToArray(ParEvent ? ParEvent.transactionID : {}))
  }, [ParEvent])
  const [editMode, setEditMode] = useState(false)
  const [passModalMode, setPassModalMode] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setErros] = useState({
    type: false,
    msg: '',
  })
  const transactionRef = useRef()
  const [newIds, setNewIds] = useState({})
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState({
    open: false,
    msg: '',
    severity: '',
    duration: '',
  })

  const clearUp = () => {
    setPassModalMode(false)
    setPassword('')
    setErros({ type: false, msg: '' })
    setEditMode(false)
  }
  const transArrToPrev = () => {
    const inputContainer = transactionRef.current
    transactionArr.forEach((item) => {
      inputContainer.querySelector(`#${item.name}`).value = item.value
    })
  }

  useEffect(() => {
    if (transactionRef && passModalMode) {
      const inputContainer = transactionRef.current
      let values = {}
      transactionArr.forEach((item) => {
        values[item.name] = inputContainer.querySelector(`#${item.name}`).value
      })
      setNewIds(values)
    }
  }, [transactionRef, passModalMode])

  const handleTrnasactionChange = () => {
    setLoading(true)
    axios
      .patch(
        reqs.TRANSACTION_ID_EDIT,
        {
          password,
          transactionObj: newIds,
          previousObj: ParEvent.transactionID,
          fullName: fullName,
          email: email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false)
        if (res.data.succeed) {
          setAlertMsg({
            open: true,
            msg: res.data.msg,
            severity: 'success',
            duration: 3000,
          })
          setAllProfileData((allProfileData) => {
            return {
              ...allProfileData,
              ParEvent: {
                ...allProfileData.ParEvent,
                transactionID: {
                  ...allProfileData.ParEvent.transactionID,
                  ...newIds,
                },
              },
            }
          })
          clearUp()
        } else setErros({ type: true, msg: res.data.msg })
      })
      .catch((err) => {
        setErros({ type: true, msg: err.response.data.msg })
        setLoading(false)
      })
  }

  return (
    <>
      <Box width={'100%'} height={'100%'} sx={{ display: 'grid' }}>
        {editMode === false && (
          <Stack
            mb={1}
            height={'max-content'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flexDirection={'row'}
          >
            <Typography color={'darkBlue.main'} fontSize={'1.1rem'}>
              Transaction ID
            </Typography>
            <IconButton onClick={(_) => setEditMode(true)}>
              <EditIcon sx={{ color: 'darkBlue.main' }} />
            </IconButton>
          </Stack>
        )}
        <Stack
          ref={transactionRef}
          sx={{
            padding: '5px 15px',
            rowGap: '20px',
          }}
        >
          {transactionArr.map((item, key) => {
            return (
              <Box
                key={key}
                width={'100%'}
                sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}
              >
                <TextField
                  variant='standard'
                  label={item.name}
                  name={item.name}
                  defaultValue={item.value}
                  id={item.name}
                  sx={{
                    '& label': {
                      fontWeight: '500',
                      color: 'darkBlue.main',
                    },
                    '& .Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0,0,0,.7)',
                      color: 'rgba(0,0,0,.7)',
                    },
                    '& .MuiInput-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0,0,0,.7)',
                      color: 'rgba(0,0,0,.7)',
                    },
                  }}
                  disabled={!editMode}
                />
                {ParEvent &&
                  (ParEvent.paidEvent[item.name] == 1 ? (
                    <VerifiedUserSharpIcon
                      sx={{
                        fontSize: '1.1rem',
                        color: 'success.dark',
                        alignSelf: 'center',
                      }}
                    />
                  ) : (
                    <PendingActionsIcon
                      sx={{
                        color: 'warning.main',
                        fontSize: '1.2rem',
                        alignSelf: 'center',
                      }}
                    />
                  ))}
              </Box>
            )
          })}
        </Stack>
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
                transArrToPrev()
                setEditMode(false)
              }}
            >
              cancel
            </Button>
          </Stack>
        )}

        {/* verification status show */}
        <Stack
          sx={{
            padding: '20px 5px 0px 5px',
          }}
        >
          <Typography
            fontSize={'.9rem'}
            color={'darkBlue.main'}
            fontWeight={'500'}
          >
            Payment status :
          </Typography>
          <Stack
            flexDirection={'row'}
            flexWrap={'wrap'}
            alignItems={'center'}
            pt={0.5}
            width={'100%'}
            columnGap={'10%'}
            pl={2}
          >
            <IconInfo
              icon={
                <PendingActionsIcon
                  sx={{ fontSize: '.95rem', color: 'warning.dark' }}
                />
              }
              label={
                <Typography
                  color={'warning.main'}
                  fontSize={'.85rem'}
                  fontWeight={'400'}
                  component={'span'}
                >
                  pending
                </Typography>
              }
              columnGap={'0px'}
            />
            <IconInfo
              icon={
                <VerifiedUserSharpIcon
                  sx={{ fontSize: '.95rem', color: 'success.dark' }}
                />
              }
              label={
                <Typography
                  component={'span'}
                  color={'success.dark'}
                  fontSize={'.85rem'}
                  fontWeight={'400'}
                >
                  verified
                </Typography>
              }
              columnGap={'0px'}
            />
          </Stack>
        </Stack>
      </Box>

      {/* password transaction edit */}
      <PasswordMOdal
        open={passModalMode}
        handleClose={() => {
          transArrToPrev()
          clearUp()
        }}
        handleSubmit={handleTrnasactionChange}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        value={password}
        error={error.type}
        helpertext={error.msg}
        loading={loading}
      >
        <Typography pl={2} mb={1} fontSize={'.9rem'}>
          Are you sure you want to make the following changes ?
          <Typography
            component={'span'}
            fontWeight={'500'}
            color={'error.dark'}
            fontSize={'.8rem'}
          >
            &nbsp;It may affect the payment status
          </Typography>
        </Typography>
        <Stack
          sx={{ width: '90%', margin: '0 auto 10px auto', padding: '0 20px' }}
        >
          {transactionArr.map((item, key) => {
            return (
              <ChangeTypo
                key={key}
                initial={item.value}
                final={
                  newIds[item.name] !== item.value
                    ? newIds[item.name]
                    : 'no change'
                }
              />
            )
          })}
        </Stack>
      </PasswordMOdal>

      {/* snackbar */}
      <CustomSnackBar
        open={alertMsg.open}
        message={alertMsg.msg}
        severity={alertMsg.severity}
        duration={alertMsg.duration}
        onClose={() => {
          setAlertMsg({ open: false, msg: '', severity: '' })
        }}
      />
    </>
  )
}
export default TransactionId

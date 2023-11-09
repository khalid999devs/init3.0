import { Grid, Typography } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { reqImgWrapper } from '../../../data/requests'
import { SmallInfoButton } from '../../../global_components/Buttons'
import { handleEventButtonClick, handlePayButtonClick } from './TableFuncs'
import { useState, useEffect } from 'react'

export const AvatarImgName = ({ image, fullName, userName }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <LazyLoadImage
          alt={'par'}
          effect='blur'
          src={reqImgWrapper(image)}
          height='34px'
          width='34px'
          style={{ borderRadius: '50%', objectFit: 'fill' }}
        />
      </Grid>
      <Grid item xs={9}>
        <Typography variant='subtitle2'>{fullName}</Typography>
        <Typography sx={{ opacity: 0.8, fontSize: '.7rem' }}>
          {userName}
        </Typography>
      </Grid>
    </Grid>
  )
}

export const EventButton = ({ event, mode, id, setAlertMsg, disableMode }) => {
  const [eventValue, setEventValue] = useState(event.value)
  const [btnDisabled, setBtnDisabled] = useState(disableMode)

  useEffect(() => {
    setBtnDisabled(disableMode)
  }, [disableMode])

  useEffect(() => {
    setEventValue(event.value)
  }, [event.value])

  return (
    <SmallInfoButton
      sx={{
        color: eventValue == 0 ? 'success.main' : 'error.main',
        borderColor: eventValue == 0 ? 'success.main' : 'error.main',
        borderWidth: mode == event.eventName ? '3px' : '',
        '&.MuiButtonBase-root:disabled': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
          opacity: '.7',
          color: eventValue == 0 ? 'success.main' : 'error.main',
          borderColor: eventValue == 0 ? 'success.main' : 'error.main',
          borderWidth: mode === event.eventName ? '3px' : '',
        },
      }}
      variant='outlined'
      disabled={btnDisabled}
      onClick={() => {
        setBtnDisabled(true)
        handleEventButtonClick(
          event.eventName,
          id,
          eventValue,
          setEventValue,
          setBtnDisabled,
          setAlertMsg
        )
      }}
    >
      {event.eventName}
    </SmallInfoButton>
  )
}

export const PayButton = ({ pay, mode, id, setAlertMsg, disableMode }) => {
  const [eventValue, setEventValue] = useState(pay.checked)
  const [btnDisabled, setBtnDisabled] = useState(disableMode)

  // console.log(eventValue)

  useEffect(() => {
    setBtnDisabled(disableMode)
  }, [disableMode])

  return (
    <SmallInfoButton
      sx={{
        color: !eventValue ? 'success.main' : 'error.main',
        borderColor: !eventValue ? 'success.main' : 'error.main',
        borderWidth: mode === pay.eventName ? '3px' : '',
        '&.MuiButtonBase-root:disabled': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
          opacity: '.7',
          color: !eventValue ? 'success.main' : 'error.main',
          borderColor: !eventValue ? 'success.main' : 'error.main',
          borderWidth: mode === pay.eventName ? '3px' : '',
        },
      }}
      style={{ fontSize: '12px', letterSpacing: '1px' }}
      variant='outlined'
      disabled={btnDisabled}
      onClick={() => {
        setBtnDisabled(true)
        handlePayButtonClick(
          pay.eventName,
          id,
          eventValue,
          setEventValue,
          setBtnDisabled,
          setAlertMsg
        )
      }}
    >
      {pay.value}
    </SmallInfoButton>
  )
}

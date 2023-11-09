import axios from 'axios'
import reqs from '../../../data/requests'

export const eventsInfoIterate = (eventInfo) => {
  let eventArray = []
  for (let event in eventInfo) {
    eventArray.push({ eventName: event, value: eventInfo[`${event}`] })
  }
  return eventArray
}

export const handlePayButtonClick = (
  eventName,
  id,
  eventChecked,
  setEventValue,
  setBtnDisabled,
  setAlertMsg
) => {
  axios
    .post(
      `${reqs.PAYMENT_VERIFICATION}${id}`,
      {
        type: eventChecked ? false : true,
        eventName: eventName,
      },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.data.succeed) {
        setAlertMsg({ msg: res.data.msg, severity: 'success' })
        setEventValue(eventChecked ? 0 : 1)
      } else {
        setAlertMsg({ msg: res.data.msg, severity: 'warning' })
      }
      setBtnDisabled(false)
    })
    .catch((err) => {
      setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
    })
}

export const handleEventButtonClick = (
  eventName,
  id,
  eventChecked,
  setEventValue,
  setBtnDisabled,
  setAlertMsg
) => {
  axios
    .patch(
      `${reqs.UPDATE_EVENT_CHECKED}${id}`,
      {
        updateType: eventChecked ? false : true,
        selectedEvent: eventName,
      },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.data.succeed) {
        setAlertMsg({ msg: res.data.msg, severity: 'success' })
        setEventValue(eventChecked ? 0 : 1)
      } else {
        setAlertMsg({ msg: res.data.msg, severity: 'warning' })
      }
      setBtnDisabled(false)
    })
    .catch((err) => {
      setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
    })
}

import { Box, Button, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send'
import CheckBox from '../Forms/CheckBox'
import { CustomInField } from '../../../global_components/CustomFormControls'
import { useForm } from '../../../custom_hooks/useForm'
import SubmissionInputs from './SubmissionInputs'
import PaymentInputs from './PaymentInputs'
import { checkFiles } from './CheckFiles'
import { submitFilesAndLinks } from './submitFilesLinks'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import reqs from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'
import { StyledLink } from '../../../customStyles/StyledLinks'

const SoloForm = ({
  setAlertModal,
  targetEvent,
  fullName,
  email,
  setAlertModalToDef,
  setLoading,
  userName,
}) => {
  const navigate = useNavigate()
  const { triggerAv, setTriggerAv } = ClientContextConsumer()
  const { fee, paid, type, value, submission, name, roll } = targetEvent
  const { values, setValues, handleInputChange } = useForm({
    CtransactionId: '',
    transactionNum: '',
    roll_no: '',
  })
  const [errors, setErrors] = useState({
    CtransactionId: '',
    transactionNum: '',
  })
  const [submitObjArr, setSubmitObjArr] = useState([])
  const [reCheck, setReCheck] = useState(false)
  const [submissionArr, setSubmissionArr] = useState([])

  useEffect(() => {
    if (submission) {
      if (submission.name) {
        let submitNames = submission.name.split(',').filter((item) => {
          if (item) return item
        })
        setSubmissionArr(submitNames)
        let sizeArray = []
        if (submission.size) {
          sizeArray = submission.size.split(',').filter((size) => {
            if (size) return size
          })
        }
        setSubmitObjArr(
          submitNames.map((item, i) => {
            if (submission.type === 'link')
              return { eventValue: value, link: '', name: item }
            else
              return {
                eventValue: value,
                file: {},
                name: item,
                size: sizeArray[i] || '',
              }
          })
        )
      }
    }
  }, [submission])

  const msgToModal = (msg, status) => {
    setAlertModal({
      state: true,
      msg: msg,
      severity: status || 'error',
      handleClose: () => setAlertModalToDef(),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading({
      state: true,
      msg: 'We are checking your informations. Please wait...',
    })
    msgToModal('', 'warning')
    let verified = true

    if (submission) {
      if (submission.type === 'file') {
        const statusMsg = checkFiles(submitObjArr)
        if (statusMsg !== 'ok') {
          verified = false
          msgToModal(statusMsg)
        }
      }
    }

    if (verified === true) {
      submitFilesAndLinks(submitObjArr, submission.type, value)
        .then((res) => {
          if (!res.succeed) {
            if (res.type === 'rd') {
              setAlertModal({
                state: true,
                severity: 'warning',
                msg: res.msg,
                handleClose: () => {
                  setAlertModalToDef()
                  navigate(`/profile/${userName}`, { replace: true })
                },
              })
            } else msgToModal(res.msg)
            setLoading({ state: false, msg: '' })
          } else {
            setLoading({ state: true, msg: 'Submitting...' })
            return axios
              .post(
                reqs.SINGLE_EVENT_PARTICIPATION,
                {
                  eventName: value,
                  CtransactionId: values.CtransactionId,
                  fullName: fullName,
                  CTransactionNum: values.transactionNum,
                  roll_no: values.roll_no,
                },
                { withCredentials: true }
              )
              .then((response) => {
                setLoading({ state: false, msg: '' })
                if (response.data.succeed) {
                  setAlertModal({
                    state: true,
                    msg: `${response.data.msg}. You can also check the status in your profile`,
                    severity: 'success',
                    handleClose: () => {
                      setAlertModalToDef()
                      navigate(`/event/${value}`)
                    },
                  })
                  setTriggerAv(!triggerAv)
                } else {
                  msgToModal(response.data.msg)
                }
              })
          }
        })
        .catch((err) => {
          console.log(err)
          setLoading({ state: false, msg: '' })
          msgToModal(err.response.data.msg || 'Something wrong happened')
        })
    } else {
      msgToModal('Error verifying your data', 'error')
      setLoading({ state: false, msg: '' })
    }
  }

  return (
    <>
      <form
        style={{
          display: 'grid',
          rowGap: '40px',
        }}
        onSubmit={handleSubmit}
      >
        {/* main form */}
        <Stack gap={3}>
          {/* participant info */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr' },
              gap: 3,
              columnGap: 5,
            }}
          >
            <CustomInField
              label={'Participant'}
              value={fullName || 'fullName'}
              disabled={true}
            />
            <CustomInField
              label={'Event'}
              value={name || 'event name'}
              disabled={true}
            />
            {roll && (
              <CustomInField
                label={'Roll no.'}
                name={'roll_no'}
                value={values.roll_no}
                onChange={handleInputChange}
                placeholder={'your roll'}
              />
            )}
          </Box>

          {/* submission and payment info */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
              },
              gap: 3,
              columnGap: 5,
            }}
          >
            {/* submission fields */}
            {type === 'online' && (
              <SubmissionInputs
                submissionArr={submissionArr}
                submitObjArr={submitObjArr}
                setSubmitObjArr={setSubmitObjArr}
                submission={submission}
              />
            )}
          </Box>

          {/* payment info */}
          {paid === true && (
            <PaymentInputs
              values={values}
              errors={errors}
              setErrors={setErrors}
              handleInputChange={handleInputChange}
              fee={fee}
              inCol={true}
              email={email}
            />
          )}
        </Stack>

        {/* checked texts */}
        <Stack width={'fit-content'} sx={{ margin: '0 auto' }}>
          <CheckBox
            text={
              <Typography
                fontSize={'.9rem'}
                textAlign={'left'}
                sx={{ wordBreak: 'break-word' }}
              >
                I rechecked all the given data and I already know the rules and
                regulations of{' '}
                <StyledLink
                  href={`/event/${targetEvent.value}`}
                  style={{ textDecoration: 'underline' }}
                  target='_blank'
                >
                  {targetEvent.name}
                </StyledLink>
              </Typography>
            }
            checked={reCheck}
            onChange={() => setReCheck(!reCheck)}
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
            disabled={!reCheck}
          >
            submit
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default SoloForm

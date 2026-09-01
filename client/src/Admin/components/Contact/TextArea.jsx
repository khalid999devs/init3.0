import { Button, Chip, Stack, TextField } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import reqs from '../../../data/requests'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'

export const TextArea = ({ email, name, replied }) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isReplied, setIsReplied] = useState(Boolean(replied))

  useEffect(() => {
    setIsReplied(Boolean(replied))
  }, [replied])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // console.log(email, value)
    setLoading(true)
    axios
      .post(
        `${reqs.EMAIL_MESSAGE}contact`,
        { text: value, subject: 'We are here for you!!', email, name },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setValue('')
          setLoading(false)
          setIsReplied(true)
        }
      })
      .catch((error) => {
        alert(error.response.data.msg)
        setLoading(false)
      })
  }
  return (
    <Stack
      component='form'
      onSubmit={handleFormSubmit}
      spacing={1}
      alignItems='flex-end'
    >
      {isReplied ? (
        <Chip
          label='Replied'
          color='success'
          variant='outlined'
          size='small'
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        />
      ) : (
        <>
          <TextField
            name='answer'
            placeholder={`Reply to ${name}`}
            variant='outlined'
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            multiline
            minRows={3}
            fullWidth
            size='small'
            sx={{
              backgroundColor: '#f8fafb',
              fontSize: '.85rem',
              fontWeight: '500',
            }}
          />
          <Button
            type='submit'
            size='small'
            variant='contained'
            color='primary'
            disabled={loading || !value.trim()}
            endIcon={loading ? <HourglassTopIcon /> : null}
          >
            Send reply
          </Button>
        </>
      )}
    </Stack>
  )
}

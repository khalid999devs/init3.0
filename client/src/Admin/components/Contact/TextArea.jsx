import { Button, Input } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import reqs from '../../../data/requests'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'

export const TextArea = ({ email, name, replied }) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isReplied, setIsReplied] = useState(false)

  useState(() => {
    setIsReplied(replied)
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
    <form
      onSubmit={handleFormSubmit}
      style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '5px',
      }}
    >
      {isReplied ? (
        <strong>replied</strong>
      ) : (
        <>
          <Input
            disableUnderline
            label={''}
            name={'ans'}
            variant={'outlined'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            multiline
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: 'semiWhite.main',
              minHeight: '100px',
              borderRadius: '10px',
              fontSize: '.85rem',
              p: 1,
              fontWeight: '500',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              sx={{ display: 'inline' }}
              type={'submit'}
              size={'small'}
              variant='outlined'
              color='darkBlue'
              disabled={loading}
              endIcon={loading ? <HourglassTopIcon /> : ''}
            >
              send
            </Button>
          </div>
        </>
      )}
    </form>
  )
}

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useForm } from '../../../custom_hooks/useForm'
import reqs from '../../../data/requests'
import { GlobalContextConsumer } from '../../../GlobalContext'

const DownloadFile = () => {
  const { events } = GlobalContextConsumer()
  const { values, setValues, handleInputChange } = useForm({
    transactionStatus: 'all',
    event: '',
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!values.event) {
      alert('please select a event')
      return
    }
    axios
      .post(
        reqs.DOWNLOAD_FILE,
        {
          eventValue: values.event,
          transactionStatus: values.transactionStatus,
        },
        { withCredentials: true, responseType: 'blob' }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${values.event}.txt`)
        document.body.appendChild(link)
        link.click()
        setValues({
          transactionStatus: 'all',
          event: '',
        })
      })
      .catch((err) => {
        // console.log(err)
        alert('Something went wrong during the process')
      })
  }
  return (
    <Box p={1} pb={3}>
      <Typography variant='h6' mb={3}>
        Transaction Status
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <InputLabel id='demo-select-small'>Event</InputLabel>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            value={values.event}
            label='Age'
            onChange={(e) =>
              setValues((values) => {
                return { ...values, event: e.target.value }
              })
            }
          >
            {events.map((event, key) => {
              return (
                <MenuItem key={key} value={event.value}>
                  {event.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <InputLabel id='demo-select-small'>Transaction status</InputLabel>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            value={values.transactionStatus}
            label='Age'
            onChange={(e) =>
              setValues((values) => {
                return { ...values, transactionStatus: e.target.value }
              })
            }
          >
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={true}>Verified</MenuItem>
            <MenuItem value={false}>Pending</MenuItem>
          </Select>
        </FormControl>

        <Box mt={4}>
          <Button variant='contained' color='primary' type='Submit'>
            Download
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default DownloadFile

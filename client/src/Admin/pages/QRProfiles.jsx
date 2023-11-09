import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAdminFetch } from '../../custom_hooks/useAdminFetch'
import { useForm } from '../../custom_hooks/useForm'
import reqs from '../../data/requests'
import { GlobalContextConsumer } from '../../GlobalContext'
import { DeleteOutline } from '@mui/icons-material'
import axios from 'axios'
import { AlertModal } from '../../global_components/Alerts'
import { UnderlinedTypo } from '../../global_components/Typographies'

const QRProfiles = () => {
  const { events } = GlobalContextConsumer()
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })
  const { data } = useAdminFetch(reqs.ALL_QR_USERS, setAlertMsg)
  const [qrProfiles, setQrProfiles] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    userName: '',
    password: '',
    event: '',
  })

  useEffect(() => {
    setQrProfiles(() => {
      return [...(data.result ? data.result : [])]
    })
  }, [data])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    axios
      .post(reqs.QR_REG, values, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setQrProfiles((qrProfiles) => {
            return [...qrProfiles, res.data.result]
          })
          setValues({
            userName: '',
            password: '',
            event: '',
          })
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  const handleDelete = (id) => {
    axios
      .delete(`${reqs.DELETE_QR_USER}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setQrProfiles((qrProfiles) => {
            return qrProfiles.filter((qrProfile) => qrProfile.id !== id)
          })
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  return (
    <Container
      sx={{
        padding: {
          xs: '0 10px 0 70px',
          xl: 0,
        },
      }}
      maxWidth={'md'}
    >
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={1500}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}
      <Box
        sx={{
          maxWidth: '700px',
          width: '100%',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <form
          style={{
            maxWidth: '500px',
            width: '100%',
            margin: '0 auto',
            boxShadow: '0px 0px 15px 2px rgba(0,0,0,.3)',
            marginBottom: '60px',
            padding: '30px',
            paddingBottom: '30px',
          }}
          onSubmit={handleFormSubmit}
        >
          <Stack flexDirection={'row'} rowGap={2}>
            <Stack width={'60%'} p={2} rowGap={3}>
              <TextField
                required
                fullWidth
                value={values.userName}
                onChange={handleInputChange}
                variant={'standard'}
                label={'Username'}
                name='userName'
              />
              <TextField
                required
                fullWidth
                value={values.password}
                onChange={handleInputChange}
                variant={'standard'}
                label={'Password'}
                name='password'
              />
            </Stack>
            <Stack
              width={'40%'}
              alignItems={'center'}
              justifyContent={'center'}
            >
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
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={'lunch'}>Lunch</MenuItem>
                  <MenuItem value={'snack'}>Snack</MenuItem>
                  {events.map((event, key) => {
                    return (
                      <MenuItem key={key} value={event.value}>
                        {event.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack
            width={'100%'}
            mt={2}
            alignItems={'flex-end'}
            justifyContent={'flex-end'}
            pr={3}
          >
            <Button type='submit' variant={'outlined'} color='secondary'>
              Submit
            </Button>
          </Stack>
        </form>

        <UnderlinedTypo
          align='center'
          text='QR Admins'
          color='darkBlue.main'
          variant='h5'
          underlined={true}
        />

        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            margin: '0 auto',
          }}
        >
          {qrProfiles.map((qrAdmin) => {
            return (
              <ListItem
                key={qrAdmin.id}
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleDelete(qrAdmin.id)}
                  >
                    <DeleteOutline sx={{ color: 'brown' }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 50,
                      height: 50,
                      margin: '5px',
                    }}
                  >
                    {qrAdmin.userName.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ fontWeight: 'bolder', paddingLeft: '30px' }}
                  primary={
                    <Typography fontWeight={500} color={'darkblue.main'}>
                      {qrAdmin.userName}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      fontWeight={'light'}
                      variant={'body2'}
                      color={'darkblue.main'}
                    >
                      {qrAdmin.event}
                    </Typography>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Container>
  )
}

export default QRProfiles

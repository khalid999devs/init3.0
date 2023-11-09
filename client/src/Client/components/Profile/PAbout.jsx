import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { GlobalContextConsumer } from '../../../GlobalContext'
import { useState } from 'react'
import AboutInfo from './AboutInfo'
import TransactionId from './TransactionId'
import PasswordMOdal from './PasswordMOdal'
import axios from 'axios'
import reqs from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'
import { ProfileContextConsumer } from '../../pages/Profile'

const PAbout = () => {
  const navigate = useNavigate()
  const { clearClientProfile } = ClientContextConsumer()
  const { setLogOutMode } = ProfileContextConsumer()
  const [deleteMode, setDeleteMode] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setErros] = useState({
    type: false,
    msg: '',
  })
  const {
    allProfileData: { ParEvent },
  } = ProfileContextConsumer()

  const deleteAccount = () => {
    axios
      .post(reqs.DELETE_ACCOUNT_CLIENT, { password }, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setLogOutMode(true)
          clearClientProfile()
          navigate(`/registration/participant`, { replace: true })
        }
      })
      .catch((err) => {
        setErros({ type: true, msg: err.response.data.msg })
      })
  }

  return (
    <Box
      width={'100%'}
      height={'auto'}
      sx={{ padding: '10px 0', display: 'grid', rowGap: '30px' }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          gap: '30px',
          mb: 3,
        }}
      >
        <Paper
          square
          sx={{ padding: '25px 10px', minHeight: '200px' }}
          elevation={3}
        >
          <AboutInfo />
        </Paper>
        <Box>
          {ParEvent &&
            (Object.keys(ParEvent.transactionID).length > 0 ? (
              <Paper
                square
                sx={{
                  padding: '25px 10px',
                  minHeight: '200px',
                }}
                elevation={3}
              >
                <TransactionId />
              </Paper>
            ) : (
              ''
            ))}
          <Stack
            flexDirection={'row'}
            gap={'30px'}
            flexWrap={'wrap'}
            alignItems={'center'}
            justifyContent={'center'}
            mt={3}
          >
            <Button
              variant='outlined'
              color='success'
              sx={{
                width: 'max-content',
                borderRadius: 0,
              }}
              startIcon={<EditIcon />}
              onClick={(_) => {
                navigate('?edit=1')
              }}
            >
              edit
            </Button>
            <Button
              variant='outlined'
              color='error'
              sx={{
                width: 'max-content',
                borderRadius: 0,
              }}
              startIcon={<DeleteIcon />}
              onClick={(_) => setDeleteMode(true)}
            >
              delete account
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* password modaldelete account */}
      <PasswordMOdal
        open={deleteMode}
        handleClose={(e) => {
          setDeleteMode(false)
        }}
        handleSubmit={deleteAccount}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        value={password}
        error={error.type}
        helpertext={error.msg}
      >
        <Typography
          mb={2}
          color={'error.dark'}
          pl={2}
          fontSize={'.95rem'}
          fontWeight={'500'}
        >
          Are you sure you want to delete your account ? This will cancel all
          your participations.
        </Typography>
      </PasswordMOdal>
    </Box>
  )
}

export default PAbout

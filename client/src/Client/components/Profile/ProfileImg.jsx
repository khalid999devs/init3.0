import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material'

import reqs, { reqImgWrapper } from '../../../data/requests'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { useState } from 'react'
import { handleCompressImg } from '../../../Utils/imgCompressor'
import axios from 'axios'
import { ClientContextConsumer } from '../../pages/Client'

const ProfileImg = ({ allProfileData, mode, setAllProfileData }) => {
  const [editMode, setEditMode] = useState(false)
  const { image, userName, fullName } = allProfileData
  const [file, setFile] = useState({})
  const [alert, setAlert] = useState({
    msg: '',
    severity: '',
  })

  const { triggerAv, setTriggerAv } = ClientContextConsumer()
  const [loading, setLoading] = useState(false)

  const handleImgSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    if (file.type) {
      let fd = new FormData()
      fd.append('name', `${userName}_${Date.now()}`)
      fd.append(`${mode === 'par' ? 'participants' : 'CA'}`, file)
      axios
        .patch(
          `${mode === 'par' ? reqs.PARTICIPANT_IMG_EDIT : reqs.CA_IMG_EDIT}`,
          fd,
          { withCredentials: true }
        )
        .then((res) => {
          setLoading(false)
          if (res.data.succeed) {
            setEditMode(false)
            setAllProfileData((allProfileData) => {
              return { ...allProfileData, image: res.data.result }
            })
            setTriggerAv(!triggerAv)
          }
          setAlert({ msg: res.data.msg, severity: 'error' })
        })
        .catch((err) => {
          setAlert({ msg: err.response.data.msg, severity: 'error' })
          setLoading(false)
        })
    } else {
      setAlert({ msg: 'you did not edit anything', severity: 'error' })
    }
  }

  return (
    <Box
      sx={{
        width: '130px',
        minHeight: '130px',
        height: '100%',
        alignSelf: 'center',
        position: 'relative',
      }}
    >
      <img
        loading='eager'
        width={'100%'}
        height={'100%'}
        style={{ objectFit: 'cover', borderRadius: '0px' }}
        src={reqImgWrapper(image)}
        alt={fullName}
      />
      <IconButton
        sx={{
          backgroundColor: 'semiWhite.main',
          position: 'absolute',
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          bottom: '-3%',
          right: '-3%',
          zIndex: 2,
          borderRadius: '0px',
          padding: '3px',
          '&:hover': {
            backgroundColor: 'semiWhite.main',
          },
        }}
        onClick={() => {
          setEditMode(true)
        }}
      >
        <CameraAltOutlinedIcon
          sx={{ color: 'primary.main', fontSize: '1.2rem' }}
        />
      </IconButton>

      {/* edit modal */}
      <Modal
        open={editMode}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: 'none',
            boxShadow: 24,
            outline: 0,
            p: 3,
          }}
        >
          <Typography
            color={'darkBlue.main'}
            fontSize={'1.3rem'}
            fontWeight={'500'}
            mt={-1}
            mb={2}
          >
            Update profile picture
          </Typography>

          <form onSubmit={handleImgSubmit}>
            {loading === false ? (
              <Stack
                p={1}
                rowGap={0.2}
                style={{ maxHeight: '75vh', overflow: 'auto' }}
              >
                <Button
                  variant='contained'
                  component='label'
                  sx={{ borderRadius: 0 }}
                  color='secondary'
                  size='small'
                >
                  Upload photo
                  <input
                    hidden
                    accept='.jpg, .jpeg, .png'
                    type='file'
                    onChange={async (e) => {
                      const compressedImg = await handleCompressImg(
                        e.target.files[0],
                        0.07,
                        800
                      )
                      setFile(compressedImg)
                    }}
                  />
                </Button>
                <Box
                  sx={{
                    maxHeight: '400px',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <img
                    width={'100%'}
                    style={{
                      objectFit: 'cover',
                      maxHeight: '400px',
                      height: 'auto',
                    }}
                    src={
                      file.type
                        ? window.URL.createObjectURL(file)
                        : reqImgWrapper(image)
                    }
                    alt='person image'
                  />
                </Box>
              </Stack>
            ) : (
              <Box sx={{ width: '80px', margin: '20px auto' }}>
                <img
                  src='/Images/loading.gif'
                  width={'100%'}
                  alt='loading...'
                />
              </Box>
            )}

            {/* alert */}
            {alert.msg && (
              <Typography
                align='center'
                sx={{
                  margin: '10px 0',
                  color:
                    alert.severity === 'warning'
                      ? 'warning.main'
                      : alert.severity === 'error'
                      ? 'error.main'
                      : alert.severity === 'success'
                      ? 'success.main'
                      : 'primary.main',
                  fontSize: '.9rem',
                  fontWeight: '500',
                }}
              >
                {alert.msg}
              </Typography>
            )}

            <Stack
              flexDirection={'row'}
              width={'100%'}
              columnGap={'20px'}
              alignItems={'center'}
              pt={2}
              justifyContent={'center'}
            >
              <Button
                variant='outlined'
                sx={{ borderRadius: 0, color: 'success.dark' }}
                type='submit'
                disabled={loading}
              >
                save
              </Button>
              <Button
                variant='outlined'
                type='button'
                color={'error'}
                onClick={() => {
                  setEditMode(false)
                  setFile({})
                }}
                sx={{ borderRadius: 0 }}
                disabled={loading}
              >
                close
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default ProfileImg

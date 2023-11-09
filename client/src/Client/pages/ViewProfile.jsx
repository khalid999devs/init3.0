import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import reqs, { reqImgWrapper } from '../../data/requests'
import { InfoTypography } from '../../global_components/Typographies'
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp'
import { CustomSnackBar } from '../../global_components/Alerts'

const ViewProfile = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState({})
  const [mode, setMode] = useState('par')
  const [openSnackBar, setOpenSnackbar] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')

  useEffect(() => {
    axios
      .get(`${reqs.PROFILE_VIEW}${username}`)
      .then((res) => {
        if (res.data.succeed) {
          const result = res.data.result
          setProfile(result)
          if (result.code) {
            setMode('ca')
          }
        } else {
          setAlertMsg(res.data.msg || '')
        }
      })
      .catch((err) => {
        setAlertMsg('did not match any record')
      })
  }, [])

  const { code, fullName, institute, image } = profile

  return (
    <Container
      maxWidth='md'
      sx={{
        paddingTop: '100px',
        display: 'grid',
        placeItems: 'center',
        minHeight: '80vh',
      }}
    >
      {alertMsg ? (
        <Typography
          align='center'
          fontSize={'1.5rem'}
          color={'secondary.light'}
        >
          {alertMsg}
        </Typography>
      ) : (
        <Stack
          sx={{
            padding: 2,
            maxWidth: '500px',
            width: '100%',
            minHeight: '250px',
            boxShadow: '1px 1px 5px 2px rgba(0,0,0,.2)',
          }}
          alignItems={'center'}
        >
          <Box sx={{ maxWidth: '100px' }}>
            <img
              src={reqImgWrapper(image) || '/Images/person.webp'}
              alt={fullName}
              style={{
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Stack rowGap={1} pt={2}>
            <InfoTypography
              label={'Fullname'}
              info={fullName}
              color={'darkBlue.main'}
            />
            <InfoTypography
              label={'Institute'}
              info={institute}
              color={'darkBlue.main'}
            />
            {mode === 'ca' && (
              <InfoTypography
                label={'CA code'}
                info={
                  <>
                    {code}
                    <IconButton
                      sx={{
                        padding: '0!important',
                        ml: 1,
                      }}
                      onClick={() => {
                        window.navigator.clipboard.writeText(code)
                        setOpenSnackbar(true)
                      }}
                    >
                      <ContentCopySharpIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </>
                }
                color={'warning.main'}
              />
            )}
          </Stack>
        </Stack>
      )}

      {/* snackbar */}
      <CustomSnackBar
        open={openSnackBar}
        onClose={() => setOpenSnackbar(false)}
        duration={3000}
      />
    </Container>
  )
}

export default ViewProfile

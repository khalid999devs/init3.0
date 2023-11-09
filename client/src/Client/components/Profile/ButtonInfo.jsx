import IconLink from './IconLink'
import InfoIcon from '@mui/icons-material/Info'
import { Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
// import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import ShareIcon from '@mui/icons-material/Share'

const ButtonInfo = ({ userName, allProfileData, setSnackBarMessage }) => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <Stack
        p={2}
        sx={{
          borderTop: '1px solid rgba(0,0,0,.2)',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Stack
          alignItems={'center'}
          justifyContent={'space-around'}
          flexDirection={'row'}
          sx={{
            maxWidth: '270px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <IconLink
            icon={
              location.pathname === `/profile/${userName}` ? (
                <InfoIcon sx={{ fontSize: '2.5rem', color: 'darkBlue.main' }} />
              ) : (
                <HomeOutlinedIcon
                  sx={{ fontSize: '2.5rem', color: 'darkBlue.main' }}
                />
              )
            }
            label={
              location.pathname === `/profile/${userName}` ? 'about' : 'home'
            }
            onClick={() => {
              navigate(
                location.pathname === `/profile/${userName}`
                  ? `about`
                  : `/profile/${userName}`
              )
            }}
          />
          {/* <IconLink
            icon={
              <DownloadOutlinedIcon
                sx={{ fontSize: '2.5rem', color: 'darkBlue.main' }}
              />
            }
            label={'pdf'}
            onClick={() => {}}
          /> */}
          <IconLink
            icon={
              <CreateOutlinedIcon
                sx={{ fontSize: '2.5rem', color: 'darkBlue.main' }}
              />
            }
            label={'edit'}
            onClick={() => {
              navigate('about?edit=1')
            }}
          />

          <IconLink
            icon={
              <ShareIcon sx={{ fontSize: '2.5rem', color: 'darkBlue.main' }} />
            }
            label={'share'}
            onClick={() => {
              window.navigator.clipboard.writeText(
                `${window.location.origin}/profile/view/${userName}`
              )
              setSnackBarMessage('Link copied to clipboard')
            }}
          />
        </Stack>
      </Stack>
    </>
  )
}

export default ButtonInfo

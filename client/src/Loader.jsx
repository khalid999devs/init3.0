import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

const Loader = ({ loading }) => {
  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={loading ? true : false}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 600,
      }}
      sx={{
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0)!important' },
      }}
    >
      <Fade in={loading ? true : false}>
        <Box
          sx={{
            width: '100%',
            minHeight: '500px',
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'primary.main',
          }}
        >
          <Box
            sx={{
              width: '100px',
              height: '100px',
              backgroundColor: 'primary.main',
              padding: '20px',
            }}
          >
            <img
              src='/Images/mLoader.gif'
              alt='Loading...'
              width={'100%'}
              loading={'eager'}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default Loader

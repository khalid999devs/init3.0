import { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import {
  Alert,
  Collapse,
  IconButton,
  Snackbar,
  Box,
  Typography,
} from '@mui/material'
import YouTubeIcon from '@mui/icons-material/YouTube'

import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import { mainBannerLink, tutorialVideoLink } from '../data/client'
import { StyledLink } from '../customStyles/StyledLinks'

const style = {
  position: 'fixed',
  top: '5%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '5px',
}

export const AlertModal = ({
  openMode,
  text,
  timeMs,
  severity,
  setAlertMsg,
}) => {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  useEffect(() => {
    setOpen(openMode)
    const timeOutId = setTimeout(() => {
      setAlertMsg({ msg: '', severity: 'info' })
      setOpen(false)
    }, timeMs)
    return () => clearTimeout(timeOutId)
  }, [openMode])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Alert variant='filled' severity={severity || 'info'}>
          {text}
        </Alert>
      </Box>
    </Modal>
  )
}

export const CustomSnackBar = ({
  open,
  message,
  cVertical,
  cHorizontal,
  cStyle,
  severity,
  onClose,
  duration,
}) => {
  const [barState, setBarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'left',
  })
  useEffect(() => {
    setBarState({
      ...barState,
      open: open,
      vertical: cVertical || 'bottom',
      horizontal: cHorizontal || 'left',
    })
  }, [open])

  const handleClose = () => {
    setBarState({ ...barState, open: false })
    onClose()
  }

  const { vertical, horizontal } = barState
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={barState.open}
      onClose={handleClose}
      key={vertical + horizontal}
      autoHideDuration={duration || 4000}
    >
      <Alert
        onClose={handleClose}
        sx={{
          width: '100%',
          backgroundColor:
            severity === 'error'
              ? 'error.main'
              : severity === 'warning'
              ? 'warning.main'
              : severity === 'success'
              ? 'success.main'
              : 'secondary.main',
          color: 'semiWhite.main',
        }}
        icon={false}
      >
        {message || 'Link copied to clipboard'}
      </Alert>
    </Snackbar>
  )
}

export const PermanentAlert = ({ cStyles }) => {
  const [open, setOpen] = useState(true)
  return (
    <Collapse in={open}>
      <Alert
        variant='filled'
        severity='info'
        color={'primary'}
        onClose={() => {
          setOpen(false)
        }}
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              setOpen(false)
            }}
          >
            <DisabledByDefaultIcon
              sx={{ fontSize: '2rem', color: 'error.light' }}
            />
          </IconButton>
        }
        sx={{
          padding: '0 10px 0 0',
          '& .MuiAlert-icon': { display: 'none' },
          '& .MuiAlert-message': { padding: 0 },
          maxWidth: '500px',
          width: 'fit-content',
          margin: 'auto',
          minHeight: '70px',
          transition: '.5s ease all',
          '&:hover': {
            transform: 'scale(1.01)',
          },
          boxShadow: '5px 5px 15px rgba(0,0,0,.3)',
          ...cStyles,
        }}
      >
        <a
          href={tutorialVideoLink}
          target='_blank'
          style={{ textDecoration: 'none' }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px auto',
              height: '100%',
            }}
          >
            {/* video sec */}
            <Box sx={{ position: 'relative' }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  backgroundColor: 'semiWhite.main',
                  borderRadius: '2px',
                  padding: '0 3px',
                  '&:hover': {
                    backgroundColor: 'semiWhite.main',
                    borderRadius: '2px',
                    padding: '0 3px',
                  },
                }}
              >
                <YouTubeIcon
                  sx={{
                    fontSize: '2.1rem',
                    color: 'error.main',
                  }}
                />
              </IconButton>
              <img
                src={mainBannerLink}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=''
              />
            </Box>
            {/* text sec */}
            <Box padding={1} pl={2}>
              <Typography
                fontSize={'1rem'}
                letterSpacing={'.9px'}
                color={'warning.light'}
                fontWeight={'bold'}
              >
                How to use our website?
              </Typography>
              <Typography
                sx={{
                  textDecoration: 'underline',
                  textTransform: 'capitalize',
                  letterSpacing: '1px',
                  color: 'info.main',
                  fontSize: '.9rem',
                }}
              >
                Watch Tutorial
              </Typography>
            </Box>
          </Box>
        </a>
      </Alert>
    </Collapse>
  )
}

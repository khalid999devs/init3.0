import { Alert, Box, Button, Modal, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { UnderlinedTypo } from './Typographies'

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  outline: 'none',
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: '5px',
}

export const ModalWithForm = ({
  text,
  handleFormSubmit,
  enc,
  children,
  error,
  formMode,
  setFormMode,
}) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (formMode !== '') {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [formMode])

  const handleClose = () => {
    setFormMode('')

    setOpen(false)
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{
        '& .MuiBackdrop-root': {
          minHeight: '100vh',
        },
      }}
    >
      <Box sx={style}>
        <UnderlinedTypo
          text={text || 'some title'}
          color={'darkBlue'}
          variant={'h6'}
          underlined={false}
        />
        <form
          style={{ width: '100%', overflow: 'auto', maxHeight: '95vh' }}
          onSubmit={handleFormSubmit}
          encType={
            enc ? 'multipart/form-data' : 'application/x-www-form-urlencoded'
          }
          method='POST'
        >
          {error && <Alert severity='error'>{error}</Alert>}
          {children}
          <Stack flexDirection={'row'} justifyContent={'flex-end'}>
            <Button variant='text' color='info' type='submit'>
              Submit
            </Button>
            <Button
              onClick={handleClose}
              variant='text'
              color='info'
              type='text'
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export const CustomModal = ({
  open,
  setOpen,
  children,
  hideClose,
  color,
  closeText,
  handleClose,
  loading,
  styles,
  handleSideClick,
}) => {
  let cStyles = styles || {}
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!handleSideClick) !loading && setOpen(false)
        else handleSideClick()
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',

          width: '100%',
          bgcolor: color || 'background.paper',
          boxShadow: 24,
          display: 'grid',
          p: 1,
          border: 'none',
          outline: 'none',
          ...cStyles,
        }}
      >
        {children}
        {!hideClose && (
          <Stack alignItems={'flex-end'} m={1} mb={0.5}>
            <Button
              variant='text'
              onClick={() => {
                if (handleClose) {
                  handleClose()
                } else setOpen(false)
              }}
              color='darkBlue'
              disabled={loading === true ? true : false}
            >
              {closeText || 'close'}
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  )
}

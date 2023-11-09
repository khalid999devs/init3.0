import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export const EditModeModal = ({ openMode, text }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(openMode)
  }, [openMode])
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            {text}
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant='contained'
            color='info'
            onClick={() => {
              setOpen(false)
            }}
          >
            Ok
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

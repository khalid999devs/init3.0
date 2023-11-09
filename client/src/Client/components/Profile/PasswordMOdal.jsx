import { Button, Modal, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { InconedTextField } from '../../../global_components/Structures'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import { Link } from 'react-router-dom'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  outline: 'none',
  boxShadow: 24,
  p: 2,
  pb: 2,
}

const PasswordMOdal = ({
  open,
  onChange,
  children,
  value,
  helpertext,
  error,
  handleSubmit,
  handleClose,
  loading,
}) => {
  const [showPass, setShowPass] = useState(false)
  const handleClickShowButton = () => {
    setShowPass(!showPass)
  }
  return (
    <Modal
      open={open}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        {children}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          style={{
            width: '100%',
            display: 'grid',
            gap: '20px',
          }}
        >
          {!loading ? (
            <Stack
              sx={{
                width: { xs: '90%', md: '80%' },
                margin: '10px auto',
              }}
            >
              <InconedTextField
                value={value}
                onChange={onChange}
                label={'password'}
                showPass={showPass}
                handleClickButton={handleClickShowButton}
                required={true}
                helpertext={helpertext}
                error={error}
                autofocused={true}
              />
              <Link
                style={{ textDecoration: 'none' }}
                to={`/login?rd=0&pm=1&di=1`}
              >
                <Typography
                  color={'info.main'}
                  align='center'
                  fontSize={'.8rem'}
                  mt={1}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Stack>
          ) : (
            <Box width={'60px'} height={'60px'} sx={{ margin: '10px auto' }}>
              <img
                src={'/Images/loading.gif'}
                alt={'Loading...'}
                width={'100%'}
              />
            </Box>
          )}
          <Stack alignItems={'flex-end'} justifyContent={'flex-end'} pt={2}>
            <Box sx={{ display: 'flex', columnGap: '10px' }}>
              <Button
                variant='text'
                color={'darkBlue'}
                endIcon={<SendIcon />}
                type='submit'
              >
                Submit
              </Button>
              <Button
                variant='text'
                color='error'
                endIcon={<CloseIcon />}
                onClick={handleClose}
              >
                cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default PasswordMOdal

import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { IconButton, Stack } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useEffect } from 'react'
import { reqImgWrapper } from '../../data/requests'
import ForwardSharpIcon from '@mui/icons-material/ForwardSharp'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

const ImgViewer = ({
  imgObj,
  modalOpen,
  setModalOpen,
  modalNum,
  totalImages,
}) => {
  const handleClose = () => setModalOpen(false)
  const [imgNum, setImgNum] = useState(0)
  useEffect(() => {
    if (modalNum == 0 || modalNum) {
      setImgNum(modalNum)
    }
  }, [modalNum])

  const handleSetImgnum = (num) => {
    let serial = num
    if (num < 0) serial = totalImages - 1
    else if (num >= totalImages) serial = 0
    setImgNum(serial)
  }

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={modalOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        backgroundColor: 'primary.main',
        '& .MuiBackdrop-root': {
          backgroundColor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxHeight: '100vh',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {/* close icon */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '3%',
            right: '3%',
            boxShadow: '2px 2px 5px 1px rgba(0,0,0,.4)',
            borderRadius: 0,
            '&:hover': {
              boxShadow: '2px 2px 5px -1px rgba(0,0,0,.3)',
              backgroundColor: 'primary.main',
            },
            backgroundColor: 'primary.main',
            zIndex: '1',
          }}
          onClick={handleClose}
        >
          <CloseOutlinedIcon sx={{ fontSize: '2rem', color: 'info.light' }} />
        </IconButton>

        <Fade in={modalOpen}>
          {/* previewer */}
          <Stack
            sx={{
              maxWidth: (theme) => theme.breakpoints.values.lg,
              width: '100%',
              minHeight: '700px',
              height: '100vh',
              margin: '0 auto',
              outline: 'none!important',
              alignItems: 'center',
              paddingTop: { xs: '80px', md: '100px' },
            }}
            rowGap={5}
          >
            <LazyLoadImage
              src={
                reqImgWrapper(imgObj && imgObj(imgNum).BigImage) ||
                '/Images/loading.gif'
              }
              style={{
                maxWidth: '100%',
                width: 'auto',
                maxHeight: '600px',
                height: 'auto',
                margin: '0 auto',
                objectFit: 'cover',
              }}
              effect='blur'
              alt={imgObj ? imgObj(imgNum).id : 'gallery image'}
            />
            <Stack
              justifyContent={'space-between'}
              width={'200px'}
              alignItems={'center'}
              flexDirection={'row'}
              sx={{
                position: 'absolute',
                left: '50%',
                // bottom: { xs: '50px', md: '80px' },
                bottom: '10%',
                transform: 'translate(-50%,0)',
              }}
            >
              <IconButton
                sx={{
                  boxShadow: '-2px 2px 5px 1px rgba(0,0,0,.4)',

                  borderRadius: 0,
                  '&:hover': {
                    boxShadow: '-2px 2px 5px -1px rgba(0,0,0,.3)',
                    backgroundColor: 'primary.main',
                  },
                  backgroundColor: 'primary.main',
                }}
                onClick={() => handleSetImgnum(imgNum - 1)}
              >
                <ForwardSharpIcon
                  sx={{
                    fontSize: '2rem',
                    color: 'info.light',
                    transform: 'rotate(-180deg)',
                  }}
                />
              </IconButton>
              <Typography
                color={'semiWhite.light'}
                fontSize={'1.1rem'}
                fontFamily={`'Titillium Web', sans-serif`}
                padding={'2px'}
              >
                {imgNum + 1}&nbsp;{'/'}&nbsp;{totalImages}
              </Typography>
              <IconButton
                sx={{
                  boxShadow: '2px 2px 5px 1px rgba(0,0,0,.4)',
                  borderRadius: 0,
                  '&:hover': {
                    boxShadow: '2px 2px 5px -1px rgba(0,0,0,.3)',
                    backgroundColor: 'primary.main',
                  },
                  backgroundColor: 'primary.main',
                }}
                onClick={() => handleSetImgnum(imgNum + 1)}
              >
                <ForwardSharpIcon
                  sx={{ fontSize: '2rem', color: 'info.light' }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Fade>
      </Box>
    </Modal>
  )
}

export default ImgViewer

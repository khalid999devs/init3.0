import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import reqs, { reqImgWrapper } from '../../data/requests'
import PageLabel from '../components/PageLabel'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import ImgViewer from '../components/ImgViewer'
import axios from 'axios'

const CGallery = () => {
  const [images, setImages] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalNum, setModalNUm] = useState(null)

  useEffect(() => {
    axios
      .get(reqs.ALL_GALLERY_IMG)
      .then((res) => {
        if (res.data.succeed) {
          setImages(res.data.result)
        } else {
          setAlertMsg(res.data.msg || '')
        }
        setLoading(false)
      })
      .catch((err) => {
        setAlertMsg(err.response ? err.response.data.msg : '')
        setLoading(false)
      })
  }, [])

  const getImg = (num) => {
    return images[num]
  }

  return (
    <>
      <PageLabel
        label={'Our colourful days'}
        fontSize={{ xs: '2.5rem', md: '3.5rem' }}
      />

      {alertMsg ? (
        <Typography
          align='center'
          marginTop={'100px'}
          fontSize={'1.5rem'}
          color={'secondary.light'}
        >
          {alertMsg}
        </Typography>
      ) : (
        <Box
          sx={{
            paddingTop: '100px',
            maxWidth: '100%',
            width: '100%',
            margin: '0 auto',
            minHeight: '100vh',
            height: '100%',
          }}
        >
          {loading ? (
            <Box sx={{ width: '80px', margin: '50px auto' }}>
              <img src='/Images/loading.gif' alt='loading...' width={'100%'} />
            </Box>
          ) : (
            <Box className='gallery'>
              {images.map((item, key) => {
                return (
                  <Box
                    key={key}
                    className='image'
                    onClick={() => {
                      setModalOpen(true)
                      setModalNUm(key)
                    }}
                  >
                    <span className='img-icon'>
                      <OpenInFullIcon
                        sx={{
                          color: 'semiWhite.main',
                          fontSize: '1.2rem',
                        }}
                      />
                    </span>
                    <span>
                      <LazyLoadImage
                        alt={'gallery image'}
                        effect='blur'
                        width={'100%'}
                        height={'100%'}
                        style={{
                          objectFit: 'cover',
                          transition: '0.3s all ease-in-out',
                        }}
                        src={reqImgWrapper(item.BigImage)}
                      />
                    </span>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      )}

      {/* img gallery modal */}
      {modalOpen && (
        <ImgViewer
          imgObj={getImg}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalNum={modalNum}
          totalImages={images.length}
        />
      )}
    </>
  )
}

export default CGallery

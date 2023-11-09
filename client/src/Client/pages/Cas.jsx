import {
  Box,
  Container,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PageLabel from '../components/PageLabel'
import StarIcon from '@mui/icons-material/Star'
import reqs, { reqImgWrapper } from '../../data/requests'
import axios from 'axios'
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp'
import {
  LazyLoadImage,
  LazyLoadComponent,
} from 'react-lazy-load-image-component'
import { CustomSnackBar } from '../../global_components/Alerts'

const Cas = () => {
  const [cas, setCas] = useState([])
  const [snackbar, setSnackBar] = useState({ state: false, msg: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .post(reqs.CA_ORDEREDBY_POINT, { skip: 0, rowNum: 30 })
      .then((res) => {
        if (res.data.succeed) setCas(res.data.result)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <PageLabel
        label={'Campus ambassadors'}
        fontSize={{ xs: '2.5rem', md: '3rem' }}
      />

      {loading ? (
        <Box sx={{ width: '80px', margin: '50px auto' }}>
          <img src='/Images/loading.gif' alt='loading...' width={'100%'} />
        </Box>
      ) : (
        <Container sx={{ paddingTop: '0' }} maxWidth='md'>
          {cas.length > 0 ? (
            <>
              {/* <Paper
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', xsm: '.8fr 1fr' },
                  maxWidth: '450px',
                  width: '100%',
                  margin: '50px auto',
                  placeItems: 'center',
                  gap: '20px',
                  padding: 3,
                  borderRadius: 0,
                }}
                elevation={3}
              >
                <StarIcon sx={{ fontSize: '8rem', color: 'warning.main' }} />
                <Typography
                  color={'secondary.main'}
                  fontSize={'.95rem'}
                  fontWeight={'600'}
                  sx={{
                    fontFamily: `'Titillium Web', sans-serif`,
                    '&::first-letter': {
                      color: 'primary.main',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    },
                    fontSize: '2.5rem',
                  }}
                >
                  Top 30 List
                  The number of the star is the point for an individual. It
                  represents his/her overall performance.The more point one has
                  the upper position he/she will get in the top 30 list.
                </Typography>
              </Paper> */}

              <Stack pt={2} mt={6} rowGap={4}>
                {cas.map((ca, key) => {
                  return (
                    <LazyLoadComponent key={key}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '80px 1fr 70px',
                          gap: '10px',
                          transition: '.5s ease all',
                          '&:hover': {
                            boxShadow: '1px 1px 5px 2px rgba(0,0,0,.2)',
                          },
                          '&:hover .username': {
                            color: 'darkBlue.main',
                          },
                        }}
                      >
                        <Box width={'100%'} sx={{ maxHeight: '100px' }}>
                          <LazyLoadImage
                            src={reqImgWrapper(ca.image)}
                            alt={ca.fullname}
                            effect={'blur'}
                            width={'100%'}
                            height={'100%'}
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                        <Stack
                          justifyContent={'space-between'}
                          sx={{
                            flexDirection: { xs: 'column', md: 'row' },
                            p: 0.2,
                            pr: { xs: 1, md: 5 },
                          }}
                          alignItems={'flex-start'}
                        >
                          <Stack>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: '1.05rem',
                                  sm: '1.2rem',
                                  md: '1.3rem',
                                },
                                opacity: '.8',
                                fontFamily: `'Titillium Web', sans-serif`,
                              }}
                              fontWeight={'600'}
                            >
                              {ca.fullName}
                            </Typography>
                            <Link
                              sx={{ textDecoration: 'none' }}
                              target={'_blank'}
                              href={`/profile/view/${ca.userName}`}
                            >
                              <Typography
                                color={'secondary.light'}
                                fontSize={'.8rem'}
                                component={'p'}
                                className='username'
                                sx={{ transition: '.5s ease all' }}
                              >
                                {ca.userName}
                              </Typography>
                            </Link>
                          </Stack>
                          <Stack flexDirection={'row'} alignItems={'center'}>
                            <Typography
                              color={'darkBlue.main'}
                              fontWeight={'500'}
                            >
                              {ca.code}
                            </Typography>
                            <IconButton
                              onClick={() => {
                                window.navigator.clipboard.writeText(ca.code)
                                setSnackBar({
                                  msg: 'CA code copied to clipboard',
                                  state: true,
                                })
                              }}
                            >
                              <ContentCopySharpIcon
                                sx={{ fontSize: '.9rem' }}
                              />
                            </IconButton>
                          </Stack>
                        </Stack>

                        {/* starts sec */}
                        {/* <Stack
                          flexDirection={'row'}
                          alignItems={'flex-start'}
                          justifyContent={'space-between'}
                          sx={{ width: '50px' }}
                          p={0.2}
                        >
                          <Typography
                            fontWeight={'bold'}
                            color={'darkBlue.main'}
                            fontSize={'1.3rem'}
                          >
                            {ca.used}
                          </Typography>
                          <StarIcon
                            sx={{ color: 'warning.main', fontSize: '1.8rem' }}
                          />
                        </Stack> */}
                      </Box>
                    </LazyLoadComponent>
                  )
                })}
              </Stack>
            </>
          ) : (
            <Typography
              mt={10}
              color={'secondary.light'}
              fontSize={'1.5rem'}
              align='center'
              width={'100%'}
            >
              No CA available
            </Typography>
          )}
        </Container>
      )}
      {/* snackbar */}
      <CustomSnackBar
        onClose={() => {
          setSnackBar({ state: false, msg: '' })
        }}
        open={snackbar.state}
        message={snackbar.msg}
      />
    </>
  )
}

export default Cas

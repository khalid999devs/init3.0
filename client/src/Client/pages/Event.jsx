import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import reqs, { reqImgWrapper } from '../../data/requests'
import PageLabel from '../components/PageLabel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import { IconedInfo } from '../../global_components/Structures'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import PublishIcon from '@mui/icons-material/Publish'
import { InfoTypography } from '../../global_components/Typographies'
import { Link as RLink } from 'react-router-dom'
import styled from '@emotion/styled'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const StyledRLink = styled(RLink)(({ theme }) => ({
  transform: 'translateY(50px)',
  position: 'relative',
  marginTop: '10px',
}))

const Event = () => {
  const { event } = useParams()
  const [eventInfo, setEventInfo] = useState({})
  const [alertMsg, setAlertMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location?.pathname])

  useEffect(() => {
    axios
      .get(`${reqs.SINGLE_EVENT}${event}`)
      .then((res) => {
        if (res.data.succeed) {
          setEventInfo(res.data.result)
        } else {
          setAlertMsg(res.data.msg || '')
        }
        setLoading(false)
      })
      .catch((err) => {
        setAlertMsg(err.response ? err.response.data.msg : '')
        setLoading(false)
      })
  }, [event])

  let {
    description,
    fee,
    image,
    maxMember,
    name,
    paid,
    place,
    regPortal,
    rules,
    submission,
    team,
    timeRange,
    type,
    value,
    videoLink,
    date,
  } = eventInfo
  submission = submission && JSON.parse(submission)

  let vDate = new Date(date)
  vDate = `${vDate.getDate()}-${vDate.getMonth() + 1}-${vDate.getFullYear()}`

  return (
    <>
      <PageLabel label={name} />
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
        <Container
          maxWidth='lg'
          sx={{ paddingTop: '50px', paddingBottom: '30px' }}
        >
          {loading ? (
            <Box sx={{ width: '80px', margin: '50px auto' }}>
              <img src='/Images/loading.gif' alt='loading...' width={'100%'} />
            </Box>
          ) : (
            <>
              {regPortal && (
                <Box
                  sx={{
                    margin: '20px auto 10px auto',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Box>
                    <StyledRLink
                      to={`/participation/${
                        team === true ? 'team' : 'solo'
                      }/${value}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        sx={{
                          borderRadius: 0,
                          fontSize: '1rem',
                          padding: '15px 30px',
                          letterSpacing: '1.6px',
                          textTransform: 'capitalize',
                        }}
                        variant='contained'
                        color='primary'
                        size='large'
                      >
                        Participate!
                      </Button>
                    </StyledRLink>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '.8rem',
                      color: 'warning.dark',
                      fontWeight: 'bold',
                      mt: 0.7,
                      wordBreak: 'break-word',
                    }}
                    textAlign={'center'}
                  >
                    (Click to participate)
                  </Typography>
                </Box>
              )}
              <Stack
                mt={2}
                sx={{
                  paddingTop: '100px',
                  rowGap: {
                    xs: '40px',
                    md: '70px',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
                    placeItems: 'center',
                    gap: '30px',
                  }}
                >
                  <Box>
                    <img
                      src={
                        image
                          ? reqImgWrapper(image).replaceAll('\\', '/')
                          : 'Images/mBanner.jpg'
                      }
                      alt='event'
                      style={{
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Stack
                    sx={{
                      justifySelf: { xs: 'center', md: 'flex-end' },
                    }}
                  >
                    <Typography
                      color={'secondary.light'}
                      sx={{
                        maxWidth: '450px',
                        '&:first-letter': {
                          color: 'darkBlue.main',
                          fontSize: '1.5rem',

                          lineHeight: '2rem',
                          letterSpacing: '0.5px',
                          fontFamily: `'Titillium Web', sans-serif`,
                          textTransform: 'uppercase',
                        },
                      }}
                      component={'div'}
                    >
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </Typography>
                    <a
                      href={videoLink}
                      target='_blank'
                      rel='noreferrer'
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography
                        mt={0.2}
                        component={'span'}
                        color={'info.main'}
                      >
                        ...Learn more
                      </Typography>
                    </a>
                  </Stack>
                </Box>
                <Stack
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    placeItems: 'center',
                    gap: '30px',
                    rowGap: {
                      xs: '50px',
                      md: '30px',
                    },
                  }}
                >
                  <Stack
                    rowGap={3}
                    sx={{
                      maxWidth: '450px',
                      width: '100%',
                      justifySelf: { xs: 'center' },
                      pl: 2,
                      pt: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'secondary.main',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        textDecoration: 'underline',
                        letterSpacing: '2px',
                      }}
                    >
                      Contest Rules:
                    </Typography>
                    {rules &&
                      rules.split('~~').map((rule, key) => {
                        return rule ? (
                          <Stack
                            key={key}
                            flexDirection={'row'}
                            columnGap={1.2}
                            pl={1}
                          >
                            <Typography
                              align='center'
                              variant='subtitle1'
                              color={'darkBlue.main'}
                              fontWeight={'bolder'}
                              sx={{
                                height: '25px',
                                minWidth: '25px',
                                mt: 0.5,
                                boxShadow: '1px 1px 3px 1px rgba(0,0,0,.17)',
                              }}
                            >
                              ➔
                            </Typography>
                            <Typography
                              color={'primary.light'}
                              fontSize={'.9rem'}
                              sx={{ wordBreak: 'break-word' }}
                              component={'div'}
                            >
                              <ReactMarkdown>{rule}</ReactMarkdown>
                            </Typography>
                          </Stack>
                        ) : (
                          ''
                        )
                      })}
                  </Stack>
                  <Box>
                    <Stack
                      width={'100%'}
                      height={'auto'}
                      alignItems={'flex-start'}
                      rowGap={2}
                      sx={{
                        flexDirection: { xs: 'row' },
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        pr: {
                          xs: 0,
                          md: 3,
                        },
                      }}
                      flexWrap={'wrap'}
                      columnGap={2}
                    >
                      <IconedInfo
                        icon={
                          <CalendarMonthIcon
                            sx={{ fontSize: '1.8rem', color: 'warning.main' }}
                          />
                        }
                        text={vDate || 'unset'}
                        title={'Date'}
                        textFontSize={'.9rem'}
                        teColor={'warning.main'}
                      />
                      <IconedInfo
                        icon={
                          <PlaceOutlinedIcon
                            sx={{ color: 'darkBlue.main', fontSize: '1.8rem' }}
                          />
                        }
                        text={
                          type === 'online'
                            ? place || 'online platform'
                            : place || 'College campus'
                        }
                        title={'Location'}
                        textFontSize={'.8rem'}
                        teColor={'warning.main'}
                      />
                      <IconedInfo
                        icon={
                          <CategoryOutlinedIcon sx={{ fontSize: '1.8rem' }} />
                        }
                        text={type}
                        title={'Type'}
                        textFontSize={'1rem'}
                        teColor={
                          type === 'online' ? 'warning.main' : 'success.light'
                        }
                      />
                      {maxMember ? (
                        <IconedInfo
                          icon={
                            <PeopleOutlinedIcon sx={{ fontSize: '2rem' }} />
                          }
                          text={maxMember}
                          title={'max members: '}
                        />
                      ) : (
                        ''
                      )}

                      <IconedInfo
                        icon={
                          <AttachMoneyOutlinedIcon
                            sx={{ fontSize: '1.8rem' }}
                          />
                        }
                        text={paid ? fee : 'free'}
                        title={'Fee: '}
                        teColor={paid ? 'error.dark' : 'success.main'}
                        textFontSize={'.85rem'}
                      />
                      <IconedInfo
                        icon={<AccessTimeIcon sx={{ fontSize: '1.8rem' }} />}
                        text={timeRange || 'unset-unset'}
                        title={'Time range'}
                        textFontSize={'.9rem'}
                        teColor={'warning.main'}
                      />
                      {submission && (
                        <>
                          {submission.name && (
                            <IconedInfo
                              text={
                                <InfoTypography
                                  label={'type'}
                                  info={
                                    submission.type &&
                                    submission.type.split(',').join(' , ')
                                  }
                                  color={'semiWhite.light'}
                                />
                              }
                              icon={
                                <PublishIcon
                                  sx={{
                                    fontSize: '1.5rem',
                                    color: 'semiWhite.main',
                                  }}
                                />
                              }
                              title={'submission info:'}
                              textFontSize={'1rem'}
                              bgcolor={'primary.light'}
                              tiColor={'info.main'}
                              teColor={'warning.light'}
                            />
                          )}
                        </>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>

              {/* last button */}
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  rowGap: 2,
                  mt: '50px',
                }}
              >
                <Typography
                  fontSize={'1.1rem'}
                  color={'info.dark'}
                  fontWeight={'600'}
                  textAlign={'center'}
                  sx={{ wordBreak: 'break-word' }}
                >
                  So, what are you waiting for?
                </Typography>
                <RLink
                  to={`/participation/${
                    team === true ? 'team' : 'solo'
                  }/${value}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      borderRadius: 0,
                      fontSize: '1rem',
                      padding: '5px 15px',
                      letterSpacing: '1.6px',
                      textTransform: 'none',
                      backgroundColor: 'error.light',
                    }}
                    variant='contained'
                    size='large'
                  >
                    Click me to Participate!
                  </Button>
                </RLink>
              </Box>
            </>
          )}
        </Container>
      )}
    </>
  )
}

export default Event

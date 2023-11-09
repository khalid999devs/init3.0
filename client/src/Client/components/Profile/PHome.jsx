import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { ProfileContextConsumer } from '../../pages/Profile'
import { QRCodeSVG } from 'qrcode.react'
import IconInfo from './IconInfo'
import EventIcon from '@mui/icons-material/Event'
import GroupsIcon from '@mui/icons-material/Groups'
import PaidIcon from '@mui/icons-material/Paid'
import QrCodeIcon from '@mui/icons-material/QrCode'
import SingleEvent from './SingleEvent'
import TeamEvent from './TeamEvent'
import { GlobalContextConsumer } from '../../../GlobalContext'
import { objToArray } from '../../../Utils/objToArray'
import StarIcon from '@mui/icons-material/Star'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { useEffect, useState } from 'react'
import { CustomModal } from '../../../global_components/Modals'

const PHome = () => {
  const { events } = GlobalContextConsumer()
  const {
    allProfileData: { ParEvent, fullName, qrCode, userName, code, used },
    mode,
  } = ProfileContextConsumer()
  const participatedEvents = ParEvent ? Object.keys(ParEvent.eventInfo) : []
  const teamEvents = ParEvent ? Object.keys(ParEvent.teamName) : []
  const paidEvents = ParEvent ? Object.keys(ParEvent.fee) : []
  const targetEventsInfo =
    events && events.filter((item) => participatedEvents.includes(item.value))
  const teamEventsInfo = objToArray(ParEvent ? ParEvent.teamName : {})
  const [eventsModalOpen, setEventsModal] = useState(false)

  useEffect(() => {
    if (mode === 'par' && localStorage.getItem('first')) {
      setEventsModal(JSON.parse(localStorage.getItem('first')).state || false)
    }
  }, [mode])

  return (
    <Box
      width={'100%'}
      height={'auto'}
      sx={{ padding: '10px 0', display: 'grid', rowGap: '30px' }}
    >
      {mode === 'par' && (
        <Paper
          sx={{ padding: '10px 10px', minHeight: '200px' }}
          variant='outlined'
          square
        >
          <Typography
            fontSize={'1.3rem'}
            pl={1}
            textTransform={'uppercase'}
            fontWeight={'bold'}
            color={'darkBlue.main'}
            mb={1}
          >
            Your events
          </Typography>
          <Stack
            flexDirection={'row'}
            p={2}
            flexWrap={'wrap'}
            sx={{
              justifyContent: {
                xs: 'center',
                sm: 'center',
              },
              pl: {
                xs: 0,
                sm: 2,
                md: 5,
              },
            }}
            gap={'20px'}
          >
            {participatedEvents.length - 2 <= 0 && (
              <Typography
                fontWeight={'bold'}
                color={'error.main'}
                fontSize='large'
              >
                You have not participated in any event yet
              </Typography>
            )}
            {targetEventsInfo.map((item, key) => {
              return <SingleEvent key={key} eventObj={item} />
            })}
          </Stack>
          <Stack pt={2} alignItems={'center'}>
            <Button
              variant='text'
              sx={{
                width: 'max-content',
                color: 'info.light',
                textTransform: 'lowercase',
                fontSize: '1rem',
                fontWeight: 'bold',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'info.main',
                },
                letterSpacing: '.9px',
              }}
              onClick={() => setEventsModal(true)}
            >
              explore all events -{'>'}
            </Button>
          </Stack>
        </Paper>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.6fr' },
          gap: '30px',
          mb: 3,
        }}
      >
        <Paper
          square
          sx={{ padding: '20px 10px', maxHeight: '400px' }}
          elevation={3}
        >
          <QRCodeSVG value={qrCode} size={'100%'} />
        </Paper>
        <Paper
          square
          sx={{ padding: '20px 10px', maxHeight: '400px' }}
          elevation={3}
        >
          {mode === 'par' ? (
            <Stack
              sx={{
                height: '100%',
                width: 'max-content',
                margin: '0 auto',
              }}
              justifyContent={'center'}
              alignItems={'flex-start'}
              rowGap={2}
            >
              <IconInfo
                icon={
                  <EventIcon
                    sx={{ fontSize: '1.5rem', color: 'warning.main' }}
                  />
                }
                label={
                  <>
                    Participated in{' '}
                    <Typography
                      component={'span'}
                      fontWeight={'bolder'}
                      fontSize={'1rem'}
                    >
                      {participatedEvents.length - 2}{' '}
                    </Typography>
                    events
                  </>
                }
              />
              <IconInfo
                icon={
                  <GroupsIcon
                    sx={{ color: 'warning.main', fontSize: '1.5rem' }}
                  />
                }
                label={'Teams : '}
                info={teamEvents.length}
              />
              <IconInfo
                icon={
                  <PaidIcon
                    sx={{ color: 'warning.main', fontSize: '1.5rem' }}
                  />
                }
                label={'Participated paid events : '}
                info={paidEvents.length}
              />
              <IconInfo
                icon={
                  <QrCodeIcon
                    sx={{ color: 'warning.main', fontSize: '1.5rem' }}
                  />
                }
                label={'code : '}
                info={qrCode}
              />
            </Stack>
          ) : (
            <>
              <Stack
                flexDirection={'row'}
                flexWrap={'wrap'}
                alignItems={'center'}
                justifyContent={'center'}
                width={'100%'}
                p={2}
                gap={'20px'}
              >
                <Typography
                  textAlign={'center'}
                  fontSize={'.8rem'}
                  color={'secondary.main'}
                >
                  The number of stars mainly represents the number of
                  participants used your Reference Code during registration.
                </Typography>
                <StarIcon sx={{ fontSize: '7rem', color: 'warning.main' }} />
                <Box width={'max-content'}>
                  <Typography
                    fontSize={'1.5rem'}
                    component={'p'}
                    fontWeight={'bold'}
                  >
                    Stars :
                  </Typography>
                  <Typography
                    fontSize={'2rem'}
                    color={'secondary.light'}
                    component={'p'}
                    align='center'
                  >
                    {used || 0}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                sx={{
                  width: 'max-content',
                  margin: '0 auto',
                }}
                justifyContent={'center'}
                alignItems={'flex-start'}
                rowGap={2}
              >
                <IconInfo
                  icon={
                    <QrCodeIcon
                      sx={{ color: 'warning.main', fontSize: '1.5rem' }}
                    />
                  }
                  label={'CA code : '}
                  info={code || qrCode}
                />
                <IconInfo
                  icon={
                    <PersonAddAlt1Icon
                      sx={{ color: 'warning.main', fontSize: '1.5rem' }}
                    />
                  }
                  label={'referenced times : '}
                  info={used || '0'}
                />
              </Stack>
            </>
          )}
        </Paper>
      </Box>

      {teamEvents.length > 0 && (
        <Paper sx={{ padding: '10px 10px', minHeight: '200px' }} elevation={0}>
          <Typography
            fontSize={'1.3rem'}
            pl={1}
            textTransform={'uppercase'}
            fontWeight={'bold'}
            color={'darkBlue.main'}
          >
            Teams
          </Typography>
          <Stack
            flexDirection={'row'}
            p={2}
            flexWrap={'wrap'}
            sx={{
              justifyContent: {
                xs: 'center',
                sm: 'center',
              },
              pl: {
                xs: 0,
                sm: 2,
                md: 5,
              },
            }}
            gap={'30px'}
          >
            {teamEventsInfo.map((item, key) => {
              return (
                <TeamEvent
                  team={item}
                  key={key}
                  userName={userName}
                  fullName={fullName}
                />
              )
            })}
          </Stack>
        </Paper>
      )}

      {/* custom event modal */}
      <CustomModal
        open={eventsModalOpen}
        handleClose={() => {
          localStorage.removeItem('first')
          setEventsModal(false)
        }}
        styles={{
          maxWidth: (theme) => theme.breakpoints.values.md,
          width: '100%',
        }}
        setOpen={() => {}}
        color={'semiWhite.main'}
      >
        <Stack
          p={2}
          rowGap={3}
          sx={{
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography color={'darkBlue.main'} fontSize={'1.3rem'}>
            Explore the events !!
          </Typography>
          <Stack
            flexDirection={'row'}
            p={0.5}
            flexWrap={'wrap'}
            gap={1}
            rowGap={4}
          >
            {events &&
              events.map((item, key) => {
                return <SingleEvent key={key} eventObj={item} />
              })}
          </Stack>
        </Stack>
      </CustomModal>
    </Box>
  )
}

export default PHome

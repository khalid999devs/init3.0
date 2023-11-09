import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material'
import { reqImgWrapper } from '../../data/requests'
import { InfoTypography } from '../../global_components/Typographies'
import { objToArray } from '../../Utils/objToArray'

const PerInfo = ({ scanInfo, curEvent, upDateInfo, code, manualMode }) => {
  const {
    className,
    events,
    fullName,
    image,
    institute,
    paid,
    team,
    userName,
    isCA,
    id,
  } = scanInfo
  const eventArray = objToArray(events)

  return (
    <Box
      sx={{
        maxWidth: '450px',
        padding: '50px 10px 10px 10px',
        width: '100%',
        margin: '70px auto 0 auto',
        boxShadow: '0 0 10px 2px rgba(0,0,0,.3)',
        position: 'relative',
        color: (theme) => theme.palette.darkBlue.main,
      }}
    >
      <Box
        sx={{
          height: '100px',
          width: '100px',

          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <img
          width={'100%'}
          height={'100%'}
          loading='lazy'
          style={{ borderRadius: '10px', objectFit: 'cover' }}
          src={reqImgWrapper(image) || `Images/person.webp`}
          alt='qr'
        />
      </Box>
      <Typography
        align='center'
        mt={1}
        mb={2}
        variant='subtitle1'
        fontWeight={'600'}
      >
        <Typography
          sx={{
            backgroundColor: 'primary.main',
            fontSize: '1rem',
            fontWeight: 'bolder',
            color: '#ffffff',
            padding: '2px 5px',
          }}
          component={'span'}
        >
          {id}
        </Typography>{' '}
        -{fullName}
        {isCA && (
          <Typography
            color={'warning.main'}
            component={'span'}
            fontSize={'.9rem'}
            fontWeight={'bold'}
          >
            {' '}
            - CA
          </Typography>
        )}
        <br />
        {paid == 0 || paid == 1 ? (
          <Typography
            fontSize={'11px'}
            letterSpacing='.5px'
            fontWeight='bold'
            color={'error.dark'}
          >
            {paid == 0 ? `( did not pay the fee )` : ''}
          </Typography>
        ) : null}
      </Typography>
      <Stack rowGap={0.5} pl={2} pt={1}>
        <InfoTypography
          label={'Institute'}
          info={institute}
          color={'secondary.light'}
        />
        <InfoTypography
          label={'username'}
          info={userName}
          color={'secondary.light'}
        />
        <InfoTypography
          label={'class'}
          info={className}
          color={'secondary.light'}
        />

        {team && (
          <InfoTypography
            label={'team name'}
            info={team}
            color={'secondary.light'}
          />
        )}

        <Stack
          sx={{ margin: '10px auto' }}
          flexDirection='row'
          flexWrap={'wrap'}
          justifyContent='center'
          alignItems={'center'}
          columnGap={0.5}
          rowGap={0.5}
        >
          {eventArray.map((event, key) => {
            return (
              <Button
                variant='outlined'
                size='small'
                sx={{
                  padding: '1px 3px',
                  borderWidth: event.name === curEvent && '3px',
                  '&:hover': {
                    borderWidth: event.name === curEvent && '3px',
                  },
                  '&.Mui-disabled': {
                    borderWidth: event.name === curEvent && '3px',
                    opacity: '.45',
                    color: event.value === 1 ? 'error.main' : 'success.main',
                    borderColor:
                      event.value === 1 ? 'error.main' : 'success.main',
                  },
                }}
                key={key}
                color={event.value === 1 ? 'error' : 'success'}
                disabled={curEvent === event.name && manualMode ? false : true}
                onClick={() =>
                  upDateInfo(event.value === 1 ? false : true, code)
                }
              >
                {event.name}
              </Button>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default PerInfo

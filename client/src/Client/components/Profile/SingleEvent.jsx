import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { reqImgWrapper } from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'
import { Link, useNavigate } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'

const SingleEvent = ({ eventObj }) => {
  const navigate = useNavigate()
  const {
    clientProfile: { clientEvents },
  } = ClientContextConsumer()
  let targetEvent = eventObj || {}

  const isClientHaveEvent = clientEvents.includes(targetEvent.value)

  return (
    <Box
      sx={{
        maxWidth: '250px',
        width: '100%',
        minHeight: '80px',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        transition: '.5s ease all',
        '&:hover': {
          boxShadow: '1px 1px 5px 1px rgba(0,0,0,.3)',
        },
      }}
    >
      <LazyLoadImage
        src={reqImgWrapper(targetEvent.image)}
        alt={targetEvent.name}
        width={'100%'}
        height={'100%'}
        style={{ objectFit: 'cover', objectPosition: '0% 0%' }}
      />
      <Box width={'100%'} height={'100%'} sx={{ padding: '3px 5px 3px 10px' }}>
        <Typography
          fontSize={'1.2rem'}
          color={'primary.light'}
          textTransform={'capitalize'}
          fontWeight={'400'}
        >
          {targetEvent.name || 'eventName'}
        </Typography>
        <Stack flexDirection={'row'} mb={1} mt={0.5} alignItems={'center'}>
          <Button
            size='small'
            variant='contained'
            color={'darkBlue'}
            sx={{
              width: 'max-content',
              fontSize: '.7rem',
              borderRadius: 0,
              color: 'semiWhite.main',
              '&:disabled': {
                borderColor: (theme) => theme.palette.darkBlue.main,
                color: (theme) => theme.palette.darkBlue.main,
                opacity: 0.5,
              },
            }}
            disabled={isClientHaveEvent ? true : false}
            onClick={(_) => {
              navigate(`/event/${targetEvent.value}`)
              localStorage.removeItem('first')
            }}
          >
            {isClientHaveEvent ? 'participated' : 'participate'}
          </Button>

          <Link
            to={`/event/${targetEvent.value}`}
            style={{ textDecoration: 'none' }}
            onClick={() => {
              localStorage.removeItem('first')
            }}
          >
            <IconButton>
              <InfoIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />
            </IconButton>
          </Link>
        </Stack>
      </Box>
    </Box>
  )
}

export default SingleEvent

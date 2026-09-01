import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import ProfileCard from '../components/Dashboard/ProfileCard'
import ParticipantsInfo from '../components/Dashboard/ParticipantsInfo'
import Messages from '../components/Dashboard/Messages'
import CAInfo from '../components/Dashboard/CAInfo'
import Notices from '../components/Dashboard/Notices'
import { Item } from '../../customStyles/PaperStyle'
import { StyledAdminContainer } from '../../customStyles/StyledContainers'

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '50%',
  },
}))

const Dashboard = () => {
  return (
    <StyledAdminContainer maxWidth={false} sx={{ px: 0 }}>
      <Box px={2} pb={2}>
        <Typography variant='h4' color='secondary.main' fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color='text.secondary'>
          Event operations, registrations, and organizer activity at a glance.
        </Typography>
      </Box>
      <Stack
        sx={{ width: '100%' }}
        direction={{ xs: 'column', tablet: 'row' }}
        spacing={{ xs: 1, sm: 1, md: 1 }}
        px={2}
      >
        <StyledBox>
          <Item>
            <ProfileCard />
          </Item>
          <Item>
            <ParticipantsInfo />
          </Item>
          <Item
            sx={{
              backgroundColor: 'primary.light',
            }}
          >
            <Messages />
          </Item>
        </StyledBox>
        <StyledBox>
          <Item>
            <CAInfo />
          </Item>
          <Item>
            <Notices />
          </Item>
        </StyledBox>
      </Stack>
    </StyledAdminContainer>
  )
}

export default Dashboard

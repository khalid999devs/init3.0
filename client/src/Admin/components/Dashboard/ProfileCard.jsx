import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState, useEffect } from 'react'
import reqs from '../../../data/requests'
import { AdminContextConsumer } from '../../pages/Admin'

const ProfileCard = () => {
  const [alladmins, setAlladmins] = useState([])
  const { adminData } = AdminContextConsumer()

  useEffect(() => {
    axios
      .get(reqs.GET_ALL_ADMINS, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.succeed) {
          setAlladmins(() => {
            return res.data.result.filter((data) => data.id !== adminData.id)
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={5}>
        <Box p={2}>
          <Avatar sx={{ bgcolor: 'darkBlue.main', margin: '5px' }}>
            {adminData.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography align='left' variant='h6' component={'p'}>
            {adminData.userName}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <Typography pl={2} align='left' variant='h6' color={'darkBlue.main'}>
            Other Admins
          </Typography>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            {alladmins.map((admin) => {
              return (
                <ListItem key={admin.id}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 30,
                        height: 30,
                        margin: '5px',
                      }}
                    >
                      {admin.userName.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ fontWeight: 'bolder' }}
                    primary={
                      <Typography fontWeight={500} color={'darkblue.main'}>
                        {admin.userName}
                      </Typography>
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ProfileCard
